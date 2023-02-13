import { HttpException, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CollaboratorsRepository } from './collaborators.repository';
import { CreateCollaboratorsDataDto } from './dtos/create-collaborators-data.dto';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class CollaboratorsService {
  constructor(
    private collaboratorsRepository: CollaboratorsRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async createCollaborator({
    collaborator: { advisor_code, email, name, surname },
    profile,
    mea,
    address,
  }: CreateCollaboratorsDataDto) {
    const collaboratorAlreadyExists =
      await this.collaboratorsRepository.findCollaborators(email, advisor_code);

    if (collaboratorAlreadyExists) {
      throw new HttpException('Collaborator already exists', 303);
    }

    const userId = uuidV4();
    const addressId = uuidV4();

    await this.collaboratorsRepository.createCollaborator({
      id: userId,
      email,
      name,
      surname,
      advisor_code,
    });

    const collaboratorProfile = {
      collaborator_id: userId,
      ...profile,
    };

    const collaboratorAddress = {
      id: addressId,
      collaborator_id: userId,
      ...address,
    };

    this.eventEmitter.emit('create.collaborator-profile', collaboratorProfile);
    this.eventEmitter.emit('create.collaborator-address', collaboratorAddress);

    if (mea.mea) {
      const meaOrExpansionCollaborator = {
        collaborator_id: userId,
        ...mea,
      };

      this.eventEmitter.emit(
        'create.collaborator-expansion',
        meaOrExpansionCollaborator,
      );
    }

    return;
  }
}
