import { Injectable } from '@nestjs/common';
import { usuarios } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CreateCollaboratorsAddressDto } from './dtos/create-collaborators-address.dto';
import { CreateCollaboratorMeA } from './dtos/create-collaborators-mea.dto';
import { CreateCollaboratorsProfileDto } from './dtos/create-collaborators-profile.dto';
import { CreateCollaboratorDto } from './dtos/create-collaborators.dto';
import { UpdateCollaboratorsProfileDto } from './dtos/update-collaborators-profile.dto';
import { UpdateCollaboratorsAddressDto } from './dtos/update-collaborators-address.dto';

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

  async findCollaborators(
    email: string,
    advisor_code: string,
    cpf: string,
    rg: string,
  ) {
    return this.prisma.usuarios.findFirst({
      where: {
        OR: [
          { cod_assessor: advisor_code },
          {
            email,
          },
          {
            colaboradores_informacoes: {
              cpf,
            },
          },
          {
            colaboradores_informacoes: {
              rg,
            },
          },
        ],
      },
    });
  }

  async findCollaboratorById(collaboratorId: string) {
    return this.prisma.usuarios.findUnique({
      where: {
        id: collaboratorId,
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

  async updateCollaborator(
    collaboratorId: string,
    { email, surname, advisor_code, name }: CreateCollaboratorDto,
  ) {
    return this.prisma.usuarios.update({
      where: {
        id: collaboratorId,
      },
      data: {
        email,
        nome: name,
        sobrenome: surname,
        cod_assessor: advisor_code,
      },
    });
  }

  async findRoleById(role_id: string) {
    return this.prisma.colaboradores_funcoes.findUnique({
      where: {
        id: role_id,
      },
    });
  }

  async updateCollaboratorsProfile(
    collaborator_id: string,
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
    return this.prisma.colaboradores_informacoes.update({
      where: {
        id_colaborador: collaborator_id,
      },
      data: {
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

  async updateCollaboratorsAddress(
    collaboratorId: string,
    {
      street,
      zip_code,
      number,
      location,
      fu,
      complement,
      neighborhood,
    }: UpdateCollaboratorsAddressDto,
  ) {
    return this.prisma.enderecos.update({
      where: { id_usuario: collaboratorId },
      data: {
        cep: zip_code,
        logradouro: street,
        localidade: location,
        numero: number,
        uf: fu,
        complemento: complement,
        bairro: neighborhood,
      },
    });
  }

  async listCollaborators(limit: number, offset: number) {
    const skip = limit * offset - limit;

    const queryCollaborators = await this.prisma.usuarios.findMany({
      orderBy: {
        nome: 'asc',
      },
      select: {
        id: true,
        nome: true,
        email: true,
        cod_interno: true,
        cod_assessor: true,
        sobrenome: true,
        colaboradores_informacoes: {
          select: {
            funcao: true,
            filial: {
              select: {
                cidades: {
                  select: {
                    cidade: true,
                  },
                },
              },
            },
            dt_entrada_av: true,
          },
        },
      },
      skip,
      take: limit,
    });

    const totalCollaborators = await this.prisma.usuarios.count();

    const collaborators = queryCollaborators.map((collaborator) => {
      return {
        id: collaborator.id,
        name: collaborator.nome,
        surname: collaborator.sobrenome,
        email: collaborator.email,
        internal_code: collaborator.cod_interno,
        advisor_code: collaborator?.cod_assessor,
        role: collaborator.colaboradores_informacoes.funcao.funcao,
        av_entry_date:
          collaborator?.colaboradores_informacoes?.dt_entrada_av || null,
        branch:
          collaborator?.colaboradores_informacoes?.filial.cidades.cidade ||
          null,
      };
    });

    return {
      total: totalCollaborators,
      collaborators,
    };
  }

  async listRoles() {
    return this.prisma.colaboradores_funcoes.findMany();
  }

  async getCollaboratorsProfile(collaborator_id: string) {
    const data = await this.prisma.usuarios.findUnique({
      where: {
        id: collaborator_id,
      },
      select: {
        nome: true,
        sobrenome: true,
        cod_assessor: true,
        cod_interno: true,
        email: true,
        dt_criacao: true,
        colaboradores_informacoes: {
          select: {
            id: true,
            cpf: true,
            rg: true,
            f_b_s: true,
            ag: true,
            conta: true,
            banco_pagamento: true,
            genero: true,
            dt_entrada_av: true,
            dt_entrada_xp: true,
            dt_saida_av: true,
            dt_nascimento: true,
            empresa_anterior: true,
            regime_contrato: true,
            filial: {
              select: {
                id: true,
                cidades: true,
              },
            },
            equipe: {
              select: {
                id: true,
                nome: true,
                lider: true,
              },
            },
            funcao: true,
          },
        },
        enderecos: {
          select: {
            id: true,
            cep: true,
            localidade: true,
            bairro: true,
            uf: true,
            complemento: true,
            numero: true,
            logradouro: true,
          },
        },
      },
    });

    return {
      name: data.nome,
      surname: data.sobrenome,
      email: data.email,
      advisor_code: data.cod_assessor,
      internal_code: data.cod_interno,
      profile: {
        id: data?.colaboradores_informacoes?.id,
        cpf: data?.colaboradores_informacoes?.cpf,
        rg: data?.colaboradores_informacoes?.rg,
        f_b_s: data?.colaboradores_informacoes?.f_b_s,
        role: data?.colaboradores_informacoes?.funcao.funcao,
        team: data?.colaboradores_informacoes?.equipe?.nome,
        contract_regime: data?.colaboradores_informacoes?.regime_contrato,
        previous_company: data?.colaboradores_informacoes?.empresa_anterior,
        birth_date: data?.colaboradores_informacoes.dt_nascimento,
        bank_agency: data?.colaboradores_informacoes?.ag,
        bank_account: data?.colaboradores_informacoes?.conta,
        bank: data?.colaboradores_informacoes?.banco_pagamento,
        gender: data?.colaboradores_informacoes?.genero,
        av_entry_date: data?.colaboradores_informacoes?.dt_entrada_av,
        xp_entry_date: data?.colaboradores_informacoes?.dt_entrada_xp,
        av_exit_date: data?.colaboradores_informacoes?.dt_saida_av,
        branch: data?.colaboradores_informacoes?.filial.cidades.cidade,
      },
      address: {
        id: data.enderecos.id,
        zip_code: data.enderecos.cep,
        location: data.enderecos.localidade,
        street: data.enderecos.logradouro,
        neighborhood: data.enderecos.bairro,
        complement: data.enderecos?.complemento,
        number: Number(data.enderecos?.numero),
        fu: data.enderecos.uf,
      },
    };
  }
}
