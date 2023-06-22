import { Injectable } from '@nestjs/common';
import { SQSService } from '../../aws/sqs/sqs.service';
import { CollaboratorsRepository } from '../../collaborators/collaborators.repository';
import { CompassRepository } from '../compass.repository';
import { CompassStatus } from '../interfaces';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  AssignCompassClientsDto,
  CreateCompassSolicitationsDto,
  FindAllClientsDto,
  ListReassignedClientsDto,
  ListRequestBackClientsDto,
  ListRequestedClientsDto,
  ReassignCompassClientsDto,
  RequestClientBackDto,
} from '../dto';

@Injectable()
export class CompassService {
  private compassQueue: string;
  private reassignClientsQueue: string;

  constructor(
    private readonly compassRepository: CompassRepository,
    private readonly collaboratorsRepository: CollaboratorsRepository,
    private readonly sqsService: SQSService,
    private readonly eventEmitter: EventEmitter2,
    private configService: ConfigService,
  ) {
    this.compassQueue = this.configService.get('SQS_COMPASS_QUEUE');
    this.reassignClientsQueue = this.configService.get(
      'SQS_REASSIGN_CLIENTS_QUEUE',
    );
  }

  async create(requesterId: string, newClients: CreateCompassSolicitationsDto) {
    const [, collaboratorId] = requesterId.split('|');

    const request = await this.compassRepository.createSolicitation(
      collaboratorId,
    );

    const status = CompassStatus.SOLICITADO;

    const parsedNewClients = newClients.clients.map((client) => {
      return {
        id_solicitacao: request.id,
        cod_assessor: newClients.advisor_code,
        cliente: client,
        status,
      };
    });

    await this.compassRepository.createClientsSolicitation(parsedNewClients);

    const message = JSON.stringify({
      eventType: ['COMPASS-CLIENT-SENDED'],
      data: { requestId: request.id },
    });

    await this.sqsService.sendMessage({
      message,
      deduplicationId: request.id,
      groupId: 'compass',
      sqsQueueUrl: this.compassQueue,
    });

    const payload = {
      name: '',
      to: 'bruno.maciel@altavistainvest.com.br',
      message:
        'Segmento compass teve novas solicitações de clientes, não se esqueça de fazer as atrobuições desses clientes!',
      subject: '[SEGMENTO COMPASS] - Novas solicitações',
    };

    this.eventEmitter.emit('notification.send-notification', payload);
  }

  async createRequestClientBack(
    collaborator_id: string,
    data: RequestClientBackDto,
  ) {
    const compassClient = await this.compassRepository.findCompassClient(
      data.client,
    );

    await this.compassRepository.createRequestClientBack({
      advisor: compassClient.cod_a_origem,
      client: data.client,
      compass_advisor: compassClient.cod_a_compass,
      reason: data.reason,
      requester_id: collaborator_id,
    });

    await this.compassRepository.updateCompassClient({
      client: data.client,
      is_returning: true,
    });

    return;
  }

  async assignClientsToCompassAdvisor({
    compass_advisor,
    clients,
  }: AssignCompassClientsDto) {
    for (const client of clients) {
      await this.compassRepository.updateCompassClient({
        advisor_compass: compass_advisor,
        client: client.code,
        available: false,
      });

      await this.compassRepository.updateClientSolicitation({
        id: client.request_id,
        status: CompassStatus.ATRIBUIDO,
        message: 'Cliente atribuído com sucesso!',
        updated_at: new Date(),
      });
    }

    this.eventEmitter.emit('compass.clients-assigned', {
      compass_advisor,
      clients,
    });

    return;
  }

  async findAllRequestedClients(
    collaborator_id: string,
    { limit, offset }: ListRequestedClientsDto,
  ) {
    const collaborator =
      await this.collaboratorsRepository.findCollaboratorById(collaborator_id);

    const { requests, total } =
      await this.compassRepository.listRequestedClients({
        advisor_code: collaborator.cod_assessor,
        requester_id: collaborator.id,
        limit: Number(limit),
        offset: Number(offset),
      });

    return {
      limit: Number(limit),
      page: Number(offset),
      total,
      requests,
    };
  }

  async findAllClients(data: FindAllClientsDto) {
    const { clients, total } = await this.compassRepository.listCompassClients({
      limit: Number(data.limit),
      offset: Number(data.offset),
      is_available: data.is_available === 'true',
      advisor: data.advisor,
      compass_advisor: data.compass_advisor,
    });

    return {
      total,
      limit: data.limit,
      offset: data.offset,
      clients,
    };
  }

  async findAllAdvisorClients(
    collaborator_id: string,
    { limit, offset, client }: FindAllClientsDto,
  ) {
    const { cod_assessor } =
      await this.collaboratorsRepository.findCollaboratorById(collaborator_id);

    const { clients, total, wealth } =
      await this.compassRepository.listAdvisorClients({
        limit: Number(limit),
        offset: Number(offset),
        advisor_code: cod_assessor,
        client: Number(client),
      });

    return {
      wealth,
      total,
      limit,
      offset,
      clients,
    };
  }

  async findCompassAdvisors() {
    return this.compassRepository.listCompassAdvisors();
  }

  async reassignClients(
    requesterId: string,
    clients: ReassignCompassClientsDto,
  ) {
    const [, collaboratorId] = requesterId.split('|');

    const { id: requestId } = await this.compassRepository.createSolicitation(
      collaboratorId,
    );

    const parseReassignedClients = clients.clients.map((request) => ({
      id_solicitacao: requestId,
      cliente: request.client,
      cod_a_destino: request.target_advisor,
      status: CompassStatus.SOLICITADO,
    }));

    await this.compassRepository.reassignClients(parseReassignedClients);

    const message = JSON.stringify({ data: { requestId } });

    await this.sqsService.sendMessage({
      deduplicationId: requestId,
      groupId: 'compass',
      sqsQueueUrl: this.reassignClientsQueue,
      message,
    });

    return;
  }

  async listReassignedClients({ limit, offset }: ListReassignedClientsDto) {
    const { requests, total } =
      await this.compassRepository.listReassignedClients({
        limit: Number(limit),
        offset: Number(offset),
      });

    return {
      total,
      limit,
      offset,
      requests,
    };
  }

  async listRequestedBackClients(
    { limit, offset }: ListRequestBackClientsDto,
    collaborator_id?: string,
  ) {
    const parsedLimit = Number(limit);
    const parsedOffset = Number(offset);

    if (collaborator_id) {
      const collaborator =
        await this.collaboratorsRepository.findCollaboratorById(
          collaborator_id,
        );

      const { requests, total } =
        await this.compassRepository.listAdvisorRequestedBackClients({
          limit: parsedLimit,
          offset: parsedOffset,
          advisor: collaborator.cod_assessor,
        });

      return {
        total,
        limit,
        offset,
        requests,
      };
    }

    const { requests, total } =
      await this.compassRepository.listAllRequestedBackClients({
        limit: parsedLimit,
        offset: parsedOffset,
      });

    return {
      total,
      limit,
      offset,
      requests,
    };
  }

  async updateRequestedBackClients(
    request_id: string,
    return_client: boolean,
    message?: string,
  ) {
    if (return_client === true) {
      const returnedClient =
        await this.compassRepository.updateRequestedBackClients({
          id: request_id,
          message: 'Cliente devolvido!',
          returned_at: new Date(),
          updated_at: new Date(),
          status: CompassStatus.ATRIBUIDO,
        });

      return this.compassRepository.deleteCompassClients(
        returnedClient.cliente,
      );
    }

    const returnedClient =
      await this.compassRepository.updateRequestedBackClients({
        id: request_id,
        message,
        updated_at: new Date(),
        status: CompassStatus.ERRO,
      });

    await this.compassRepository.updateCompassClient({
      is_returning: false,
      client: returnedClient.cliente,
    });

    return;
  }

  async getCompassData() {
    return this.compassRepository.getCompassData();
  }
}
