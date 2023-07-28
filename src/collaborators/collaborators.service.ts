import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CollaboratorsRepository } from './collaborators.repository';
import { CreateCollaboratorsDataDto } from './dtos/create-collaborators-data.dto';
import { v4 as uuidV4 } from 'uuid';
import { UpdateCollaboratorsDataDto } from './dtos/update-collaborators-data.dto';
import { UpdateCollaboratorsProfileDto } from './dtos/update-collaborators-profile.dto';
import { UpdateCollaboratorsAddressDto } from './dtos/update-collaborators-address.dto';
import { SolidesService } from 'src/solides/solides.service';

@Injectable()
export class CollaboratorsService {
  constructor(
    private collaboratorsRepository: CollaboratorsRepository,
    private eventEmitter: EventEmitter2,
    private solidesService: SolidesService,
  ) {}

  async createCollaborator({
    collaborator: {
      advisor_code,
      email,
      name,
      surname,
      department_id,
      position_id,
    },
    profile,
    mea,
    address,
  }: CreateCollaboratorsDataDto): Promise<void> {
    const collaboratorAlreadyExists =
      await this.collaboratorsRepository.findCollaborators({
        advisor_code,
        cpf: profile.cpf,
        email,
        rg: profile.rg,
      });

    if (collaboratorAlreadyExists) {
      throw new HttpException('Collaborator already exists', 303);
    }

    if (!email.includes('@altavistainvest.com.br')) {
      throw new HttpException('Invalid e-mail domain', 400);
    }

    const userId = uuidV4();
    const addressId = uuidV4();

    const collaborator = await this.collaboratorsRepository.createCollaborator({
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

    const role = await this.collaboratorsRepository.findRoleById(
      profile.role_id,
    );

    const collaboratorAuthProvider = {
      family_name: surname,
      name,
      collaborator_id: userId,
      internal_code: collaborator.cod_interno,
      email,
      advisor_code,
      role: role.funcao,
    };

    this.eventEmitter.emit('create.collaborator-profile', collaboratorProfile);
    this.eventEmitter.emit('create.collaborator-address', collaboratorAddress);
    this.eventEmitter.emit('solides.create-collaborator', {
      name: `${name} ${surname}`,
      email,
      id_number: String(
        Math.floor(100000 + Math.random() * 900000000) + 10000000000,
      ),
      department_id: Number(department_id),
      position_id: Number(position_id),
    });

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

    this.eventEmitter.emit('collaborator.created', collaboratorAuthProvider);

    return;
  }

  async updateCollaborator(
    collaboratorId: string,
    { collaborator }: UpdateCollaboratorsDataDto,
  ) {
    const findCollaboratorById =
      await this.collaboratorsRepository.findCollaboratorById(collaboratorId);

    if (!findCollaboratorById) {
      throw new NotFoundException();
    }

    await this.collaboratorsRepository.updateCollaborator(
      collaboratorId,
      collaborator,
    );
  }

  async updateCollaboratorProfile(
    collaboratorId: string,
    {
      av_departure_date,
      av_entry_date,
      bank_account,
      bank_agency,
      birth_date,
      branch_id,
      contract_regime,
      f_b_s,
      gender,
      payment_bank,
      previous_company,
      role_id,
      team_id,
      xp_entry_date,
    }: UpdateCollaboratorsProfileDto,
  ) {
    /* Separa os valores */
    const birthDateString = String(birth_date).split('/');
    const entryDateString = String(av_entry_date).split('/');
    const departureDateString = String(av_departure_date).split('/');

    /* Define a data com os valores separados */
    const birthDate = new Date(
      Number(birthDateString[2]),
      Number(birthDateString[1]) - 1,
      Number(birthDateString[0]),
    );

    const entryDate = new Date(
      Number(entryDateString[2]),
      Number(entryDateString[1]) - 1,
      Number(entryDateString[0]),
    );

    const departureDate = new Date(
      Number(departureDateString[2]),
      Number(departureDateString[1]) - 1,
      Number(departureDateString[0]),
    );

    return this.collaboratorsRepository.updateCollaboratorsProfile(
      collaboratorId,
      {
        av_departure_date: departureDate,
        av_entry_date: entryDate,
        bank_account,
        bank_agency,
        birth_date: birthDate,
        branch_id,
        contract_regime,
        f_b_s,
        gender,
        payment_bank,
        previous_company,
        role_id,
        team_id,
        xp_entry_date,
      },
    );
  }

  async updateCollaboratorAddress(
    collaboratorId: string,
    {
      complement,
      fu,
      location,
      neighborhood,
      number,
      street,
      zip_code,
    }: UpdateCollaboratorsAddressDto,
  ): Promise<void> {
    const collaborator =
      await this.collaboratorsRepository.findCollaboratorById(collaboratorId);

    if (!collaborator) {
      throw new NotFoundException('Collaborator not found');
    }

    await this.collaboratorsRepository.updateCollaboratorsAddress(
      collaboratorId,
      {
        complement,
        fu,
        location,
        neighborhood,
        number,
        street,
        zip_code,
      },
    );
  }

  async listCollaborators(limit: number, offset: number) {
    const { collaborators, total } =
      await this.collaboratorsRepository.listCollaborators(limit, offset);

    return {
      limit,
      page: offset,
      total,
      collaborators,
    };
  }

  async listRoles() {
    return this.collaboratorsRepository.listRoles();
  }

  async listDepartments() {
    return this.solidesService.getDepartments();
  }

  async listPositions() {
    return this.solidesService.getPositions();
  }

  async getCollaboratorProfile(collaborator_id: string) {
    return this.collaboratorsRepository.getCollaboratorsProfile(
      collaborator_id,
    );
  }
}
