import { Injectable } from '@nestjs/common';
import { CompassRepository } from '../compass.repository';
import { CollaboratorsRepository } from 'src/collaborators/collaborators.repository';
import {
  AssignCompassClientsDto,
  FindAllClientsDto,
  ListReassignedClientsDto,
  ListRequestBackClientsDto,
  ReassignCompassClientsDto,
} from '../dto';
import { CompassStatus } from '../interfaces';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class CompassAdminService {
  constructor(
    private readonly compassRepository: CompassRepository,
    private readonly collaboratorsRepository: CollaboratorsRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async getCompassData() {
    return this.compassRepository.getCompassData();
  }

  async listAllClients(data: FindAllClientsDto) {
    const { clients, total } = await this.compassRepository.listCompassClients({
      limit: Number(data.limit),
      offset: Number(data.offset),
      is_available: data.is_available === 'true',
      advisor: data.advisor,
      compass_advisor: data.compass_advisor,
      client: data.client !== '' && Number(data.client),
    });

    return {
      total,
      limit: data.limit,
      offset: data.offset,
      clients,
    };
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

    // const message = JSON.stringify({ data: { requestId } });

    // await this.sqsService.sendMessage({
    //   deduplicationId: requestId,
    //   groupId: 'compass',
    //   sqsQueueUrl: this.reassignClientsQueue,
    //   message,
    // });

    this.eventEmitter.emit('compass.clients-reassigned', requestId);
  }

  async listRequestedBackClients({ limit, offset }: ListRequestBackClientsDto) {
    const parsedLimit = Number(limit);
    const parsedOffset = Number(offset);

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

  async updateRequestedBackClients(
    request_id: string,
    return_client: boolean,
    message?: string,
  ) {
    const requestedBackClient =
      await this.compassRepository.findRequestedBackClientById(request_id);

    if (return_client === true) {
      const returnedClient =
        await this.compassRepository.updateRequestedBackClients({
          id: request_id,
          message: 'Cliente devolvido!',
          returned_at: new Date(),
          updated_at: new Date(),
          status: CompassStatus.ATRIBUIDO,
        });

      const payload = {
        name: '',
        to: requestedBackClient.assessor_origem.email,
        message: `A sua solicitação de retorno do cliente ${requestedBackClient.cliente} foi processada, ele voltará para sua base em breve!`,
        subject: '[SEGMENTO COMPASS] - Devolução de cliente',
      };

      this.eventEmitter.emit('notification.send-notification', payload);

      //Envia mensagem para quem faz as devoluções dos clientes no Connect
      const requestedBackPayload = {
        name: '',
        to: requestedBackClient.assessor_origem.email,
        subject: '[SEGMENTO COMPASS] - Devolução de cliente',
      };

      this.eventEmitter.emit(
        'notification.send-notification',
        requestedBackPayload,
      );

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

    const payload = {
      name: '',
      to: requestedBackClient.assessor_origem.email,
      message: `A sua solicitação de retorno do cliente ${requestedBackClient.cliente} foi posta em espera. Você pode conferir o motivo pela Intranet.`,
      subject: '[SEGMENTO COMPASS] - Devolução de cliente',
    };

    this.eventEmitter.emit('notification.send-notification', payload);

    return;
  }
}
