import { Injectable } from '@nestjs/common';
import { SQSService } from 'src/aws/sqs/sqs.service';
import { CollaboratorsRepository } from 'src/collaborators/collaborators.repository';
import { CompassRepository } from './compass.repository';
import { CreateCompassSolicitationsDto } from './dto/create-compass-solicitations.dto';
import { FindAllClientsDto } from './dto/find-all-clients.dto';
import { ListRequestedClientsDto } from './dto/list-requested-clients.dto';
import { ReassignCompassClientsDto } from './dto/reassign-compass-clients.dto';
import { ListReassignedClientsDto } from './dto/list-reassigned-compass-clients.dto';

enum CompassStatus {
  SOLICITADO = 'SOLICITADO',
}

@Injectable()
export class CompassService {
  constructor(
    private readonly compassRepository: CompassRepository,
    private readonly collaboratorsRepository: CollaboratorsRepository,
    private readonly sqsService: SQSService,
  ) {}

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
        cliente: Number(client),
        status,
      };
    });

    await this.compassRepository.createClientsSolicitation(parsedNewClients);

    await this.sqsService.sendMessage({
      message: request.id,
      deduplicationId: request.id,
      groupId: 'compass',
    });
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

  async assignClientsToCompassAdvisor(client: string, compass_advisor: string) {
    return this.compassRepository.assignClients(
      Number(client),
      compass_advisor,
    );
  }

  async findAllClients(data: FindAllClientsDto) {
    const { clients, total } = await this.compassRepository.listCompassClients({
      limit: Number(data.limit),
      offset: Number(data.offset),
      isAvailable: data.isAvailable === 'true',
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
    collaboratorId: string,
    { limit, offset }: FindAllClientsDto,
  ) {
    const { clients, total, wealth } =
      await this.compassRepository.listAdvisorClients({
        limit: Number(limit),
        offset: Number(offset),
        collaboratorId: collaboratorId,
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
    return this.collaboratorsRepository.findCollaboratorsByRole(
      'Assessor compass',
    );
  }

  async reassignClients(
    requesterId: string,
    clients: ReassignCompassClientsDto,
  ) {
    const [, collaboratorId] = requesterId.split('|');

    const { id: requestId } = await this.compassRepository.createSolicitation(
      collaboratorId,
    );

    const parseReassignedClients = clients.requests.map((request) => ({
      id_solicitacao: requestId,
      cliente: request.client,
      status: CompassStatus.SOLICITADO,
    }));

    await this.compassRepository.reassignClients(parseReassignedClients);

    clients.requests.forEach((request) => {
      const message = JSON.stringify({
        Body: { client: request.client, compass_advisor: request.advisor },
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
}
