import { Injectable } from '@nestjs/common';
import { SQSService } from '../../aws/sqs/sqs.service';
import { CollaboratorsRepository } from '../../collaborators/collaborators.repository';
import { CompassRepository } from '../compass.repository';
import { CompassStatus } from '../interfaces';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  CreateCompassSolicitationsDto,
  FindAllClientsDto,
  ListRequestBackClientsDto,
  ListRequestedClientsDto,
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
        'Novos clientes foram enviados ao segmento compass, não se esqueça de fazer as atribuições desses clientes!',
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

    const payload = {
      name: '',
      to: 'bruno.maciel@altavistainvest.com.br',
      message:
        'Um assessor solicitou seu cliente de volta para a base de origem, entre na Intranet e faça a devolução.',
      subject: '[SEGMENTO COMPASS] - Devolução de cliente',
    };

    this.eventEmitter.emit('notification.send-notification', payload);

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

  async listRequestedBackClients(
    { limit, offset }: ListRequestBackClientsDto,
    collaborator_id?: string,
  ) {
    const parsedLimit = Number(limit);
    const parsedOffset = Number(offset);

    const collaborator =
      await this.collaboratorsRepository.findCollaboratorById(collaborator_id);

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
}
