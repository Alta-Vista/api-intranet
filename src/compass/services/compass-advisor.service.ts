import { Injectable } from '@nestjs/common';
import { CompassRepository } from '../compass.repository';
import { FindAllClientsDto } from '../dto/find-all-clients.dto';
import { CollaboratorsRepository } from '../../collaborators/collaborators.repository';
import { ListRequestBackClientsDto } from '../dto/list-requested-back-clients.dto';

@Injectable()
export class CompassAdvisorService {
  constructor(
    private readonly compassRepository: CompassRepository,
    private readonly collaboratorsRepository: CollaboratorsRepository,
  ) {}

  async getClients(
    collaborator_id: string,
    { limit, offset, client }: FindAllClientsDto,
  ) {
    const user = await this.collaboratorsRepository.findCollaboratorById(
      collaborator_id,
    );

    const { clients, total, wealth } =
      await this.compassRepository.listCompassAdvisorClients({
        limit: Number(limit),
        offset: Number(offset),
        compass_advisor: user.cod_assessor,
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
    { limit, offset, client }: ListRequestBackClientsDto,
    collaborator_id?: string,
  ) {
    const parsedLimit = Number(limit);
    const parsedOffset = Number(offset);

    const collaborator =
      await this.collaboratorsRepository.findCollaboratorById(collaborator_id);

    const { requests, total } =
      await this.compassRepository.listCompassAdvisorsReturnedClients({
        limit: parsedLimit,
        offset: parsedOffset,
        advisor: collaborator.cod_assessor,
        client: Number(client),
      });

    return {
      total,
      limit,
      offset,
      requests,
    };
  }
}
