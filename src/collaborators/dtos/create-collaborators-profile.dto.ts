import { IsDate, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

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
  @IsOptional()
  collaborator_id: string;

  @IsString()
  rg: string;

  @IsString()
  cpf: string;

  @IsString()
  birth_date: Date;

  @IsEnum(Gender)
  gender: Gender;

  @IsEnum(FrontBackSales)
  f_b_s: FrontBackSales;

  @IsUUID()
  branch_id: string;

  @IsUUID()
  team_id: string;

  @IsUUID()
  role_id: string;

  @IsString()
  payment_bank: string;

  @IsString()
  bank_agency: string;

  @IsString()
  bank_account: string;

  @IsEnum(ContractRegime)
  contract_regime: ContractRegime;

  @IsString()
  @IsOptional()
  previous_company: string;

  @IsString()
  av_entry_date: Date;

  @IsString()
  @IsOptional()
  xp_entry_date: Date;

  @IsString()
  @IsOptional()
  av_departure_date: Date;
}
