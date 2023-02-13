import { HttpException, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CollaboratorsRepository } from '../collaborators.repository';
import { CreateCollaboratorsAddressDto } from '../dtos/create-collaborators-address.dto';
import { CreateCollaboratorMeA } from '../dtos/create-collaborators-mea.dto';
import { CreateCollaboratorsProfileDto } from '../dtos/create-collaborators-profile.dto';

@Injectable()
export class CollaboratorCreatedListener {
  constructor(private collaboratorsRepository: CollaboratorsRepository) {}

  @OnEvent('create.collaborator-profile')
  async createCollaboratorsProfile({
    av_departure_date,
    av_entry_date,
    bank_account,
    bank_agency,
    birth_date,
    branch_id,
    collaborator_id,
    contract_regime,
    cpf,
    f_b_s,
    gender,
    payment_bank,
    previous_company,
    rg,
    role_id,
    team_id,
    xp_entry_date,
  }: CreateCollaboratorsProfileDto) {
    const collaboratorProfile =
      await this.collaboratorsRepository.findCollaboratorsProfile(
        collaborator_id,
      );

    if (collaboratorProfile) {
      throw new HttpException('Collaborator profile already created', 303);
    }

    /* Separa os valores */
    const birthDateString = String(birth_date).split('/');
    const entryDateString = String(av_entry_date).split('/');

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

    return this.collaboratorsRepository.createCollaboratorsProfile({
      av_departure_date,
      av_entry_date: entryDate,
      bank_account,
      bank_agency,
      birth_date: birthDate,
      branch_id,
      collaborator_id,
      contract_regime,
      cpf,
      f_b_s,
      gender,
      payment_bank,
      previous_company,
      rg,
      role_id,
      team_id,
      xp_entry_date,
    });
  }

  @OnEvent('create.collaborator-expansion')
  async createCollaboratorMeA({
    collaborator_id,
    mea_id,
    rented_advisor_code,
  }: CreateCollaboratorMeA) {
    return this.collaboratorsRepository.createCollaboratorsMeA({
      collaborator_id,
      mea_id,
      rented_advisor_code,
    });
  }

  @OnEvent('create.collaborator-address')
  async createCollaboratorAddress(data: CreateCollaboratorsAddressDto) {
    return this.collaboratorsRepository.createCollaboratorAddress(data);
  }
}
