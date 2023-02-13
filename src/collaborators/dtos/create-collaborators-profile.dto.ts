enum Gender {
  MASCULINO = 'MASCULINO',
  FEMININO = 'FEMININO',
}

enum FrontBackSales {
  FRONT = 'FRONT',
  BACK = 'BACK',
  SALES = 'SALES',
}

enum ContractRegime {
  CLT = 'CLT',
  ASSOCIADO = 'ASSOCIADO',
}

export class CreateCollaboratorsProfileDto {
  collaborator_id: string;
  rg: string;
  cpf: string;
  birth_date: Date;
  gender: Gender;
  f_b_s: FrontBackSales;
  branch_id: string;
  team_id: string;
  role_id: string;
  payment_bank: string;
  bank_agency: string;
  bank_account: string;
  contract_regime: ContractRegime;
  previous_company: string;
  av_entry_date: Date;
  xp_entry_date: Date;
  av_departure_date: Date;
}
