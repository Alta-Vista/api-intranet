import { Injectable } from '@nestjs/common';
import { SQSService } from 'src/aws/sqs/sqs.service';
import { CollaboratorsRepository } from 'src/collaborators/collaborators.repository';
import { CompassRepository } from './compass.repository';
import { CreateCompassSolicitationsDto } from './dto/create-compass-solicitations';
import { ListRequestedClientsDto } from './dto/list-requested-clients.dto';
import { UpdateCompassDto } from './dto/update-compass.dto';

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

    const parsedNewClients = newClients.client.map((client) => {
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

    const requests = await this.compassRepository.listRequestedClients({
      advisor_code: collaborator.cod_assessor,
      requester_id: collaborator.id,
      limit: Number(limit),
      offset: Number(offset),
    });

    return {
      limit: Number(limit),
      page: Number(offset),
      total: requests.total,
      requests: requests.requests,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} compass`;
  }

  update(id: number, updateCompassDto: UpdateCompassDto) {
    return `This action updates a #${id} compass`;
  }

  remove(id: number) {
    return `This action removes a #${id} compass`;
  }
}
