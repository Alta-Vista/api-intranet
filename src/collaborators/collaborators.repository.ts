import { Injectable } from '@nestjs/common';
import { usuarios } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { CreateCollaboratorsAddressDto } from './dtos/create-collaborators-address.dto';
import { CreateCollaboratorMeA } from './dtos/create-collaborators-mea.dto';
import { CreateCollaboratorsProfileDto } from './dtos/create-collaborators-profile.dto';
import { CreateCollaboratorDto } from './dtos/create-collaborators.dto';

@Injectable()
export class CollaboratorsRepository {
  constructor(private prisma: PrismaService) {}

  async createCollaborator({
    id,
    advisor_code,
    email,
    name,
    surname,
  }: CreateCollaboratorDto): Promise<usuarios> {
    return this.prisma.usuarios.create({
      data: {
        id,
        email,
        nome: name,
        sobrenome: surname,
        cod_assessor: advisor_code,
      },
    });
  }

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
    return this.prisma.colaboradores_informacoes.create({
      data: {
        id_colaborador: collaborator_id,
        rg,
        cpf,
        dt_nascimento: birth_date,
        genero: gender,
        f_b_s,
        id_filial: branch_id,
        id_equipe: team_id,
        id_funcao: role_id,
        banco_pagamento: payment_bank,
        ag: bank_agency,
        conta: bank_account,
        regime_contrato: contract_regime,
        empresa_anterior: previous_company,
        dt_entrada_av: av_entry_date,
        dt_entrada_xp: xp_entry_date,
        dt_saida_av: av_departure_date,
      },
    });
  }

  async createCollaboratorsMeA({
    collaborator_id,
    mea_id,
    rented_advisor_code,
  }: CreateCollaboratorMeA) {
    return this.prisma.colaboradores_expansao.create({
      data: {
        cod_a_tombado: rented_advisor_code,
        id_colaborador: collaborator_id,
        id_mea: mea_id,
      },
    });
  }

  async createCollaboratorAddress({
    collaborator_id,
    id,
    complement,
    fu,
    location,
    neighborhood,
    number,
    street,
    zip_code,
  }: CreateCollaboratorsAddressDto) {
    return this.prisma.enderecos.create({
      data: {
        id,
        bairro: neighborhood,
        cep: zip_code,
        logradouro: street,
        complemento: complement,
        id_usuario: collaborator_id,
        localidade: location,
        uf: fu,
        numero: number,
      },
    });
  }

  async findCollaborators(email: string, advisor_code: string) {
    return this.prisma.usuarios.findFirst({
      where: {
        OR: [
          { cod_assessor: advisor_code },
          {
            email,
          },
        ],
      },
    });
  }

  async findCollaboratorsProfile(collaborator_id: string) {
    return this.prisma.colaboradores_informacoes.findFirst({
      where: {
        id_colaborador: collaborator_id,
      },
    });
  }
}
