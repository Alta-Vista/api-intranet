import { Exclude, Expose } from 'class-transformer';
import { CollaboratorsEntity } from './collaborators.entity';
import { CollaboratorsRoleEntity } from './collaborators-role.entity';
import { OfficesEntity } from 'src/offices/entities/officess.entity';

enum CollaboratorGender {
  MASCULINO = 'MASCULINO',
  FEMININO = 'FEMININO',
}

enum CollaboratorFBS {
  FRONT = 'FRONT',
  BACK = 'BACK',
  SALES = 'SALES',
}

enum CollaboratorContractRegime {
  CLT = 'CLT',
  ASSOCIADO = 'ASSOCIADO',
}

export class CollaboratorsInformationEntity {
  id: string;

  @Exclude()
  id_colaborador: string;

  @Expose()
  rg: string;

  @Expose()
  cpf: string;

  @Expose({ name: 'birth_date' })
  dt_nascimento: Date;

  @Expose({ name: 'gender' })
  genero: CollaboratorGender;

  @Expose()
  f_b_s: CollaboratorFBS;

  @Exclude()
  id_filial: string;

  @Exclude()
  id_equipe: string;

  @Exclude()
  id_funcao: string;

  @Expose({ name: 'payment_bank' })
  banco_pagamento: string;

  @Expose({ name: 'bank_agency' })
  ag: string;

  @Expose({ name: 'bank_account' })
  conta: string;

  @Expose({ name: 'contract_regime' })
  regime_contrato: CollaboratorContractRegime;

  @Expose({ name: 'previous_company' })
  empresa_anterior: string;

  @Expose({ name: 'av_entry_date' })
  dt_entrada_av: Date;

  @Expose({ name: 'entry_date_xp' })
  dt_entrada_xp: Date;

  @Expose({ name: 'departure_date' })
  dt_saida_av: Date;

  funcao: CollaboratorsRoleEntity;

  colaborador: CollaboratorsEntity;

  filial: OfficesEntity;

  constructor(partial: Partial<CollaboratorsInformationEntity>) {
    Object.assign(this, partial);
  }
}
