import { Injectable, NotFoundException } from '@nestjs/common';
import { SQSService } from 'src/aws/sqs/sqs.service';
import { CollaboratorsRepository } from 'src/collaborators/collaborators.repository';
import { CompassRepository } from './compass.repository';
import { CreateCompassSolicitationsDto } from './dto/create-compass-solicitations.dto';
import { FindAllClientsDto } from './dto/find-all-clients.dto';
import { ListRequestedClientsDto } from './dto/list-requested-clients.dto';
import { ReassignCompassClientsDto } from './dto/reassign-compass-clients.dto';
import { ListReassignedClientsDto } from './dto/list-reassigned-compass-clients.dto';
import { CompassStatus } from './interfaces';
import { AssignCompassClientsDto } from './dto/assign-compass-clients.dto';
import { RequestClientBackDto } from './dto/request-client-back.dto';
import { ListRequestBackClientsDto } from './dto/list-requested-back-clients.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CompassService {
  private compassQueue: string;

  constructor(
    private readonly compassRepository: CompassRepository,
    private readonly collaboratorsRepository: CollaboratorsRepository,
    private readonly sqsService: SQSService,
    private configService: ConfigService,
  ) {
    this.compassQueue = this.configService.get('SQS_COMPASS_QUEUE');
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

    console.log(parsedNewClients);

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
    client,
    compass_advisor,
    solicitation_id,
  }: AssignCompassClientsDto) {
    const findSolicitation =
      await this.compassRepository.findClientSolicitationById(solicitation_id);

    if (!findSolicitation) {
      throw new NotFoundException();
    }

    await this.compassRepository.updateCompassClient({
      advisor_compass: compass_advisor,
      client: Number(client),
      available: false,
    });

    await this.compassRepository.updateClientSolicitation({
      id: solicitation_id,
      status: CompassStatus.ATRIBUIDO,
      message: 'Cliente atribuído com sucesso!',
      updated_at: new Date(),
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
    { limit, offset }: FindAllClientsDto,
  ) {
    const { cod_assessor } =
      await this.collaboratorsRepository.findCollaboratorById(collaborator_id);

    const { clients, total, wealth } =
      await this.compassRepository.listAdvisorClients({
        limit: Number(limit),
        offset: Number(offset),
        advisor_code: cod_assessor,
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
      status: CompassStatus.SOLICITADO,
    }));

    await this.compassRepository.reassignClients(parseReassignedClients);

    clients.clients.forEach((request) => {
      const message = JSON.stringify({
        data: {
          client: request.client,
          compass_advisor: request.advisor,
        },
        eventType: ['COMPASS-REASSIGN-CLIENTS'],
      });

      return this.sqsService.sendMessage({
        deduplicationId: `${request.client}-${request.advisor}`,
        groupId: 'compass',
        message,
      });
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
