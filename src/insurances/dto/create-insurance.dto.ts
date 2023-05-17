import { IsEnum, IsNumber, IsString, ValidateIf } from 'class-validator';
import { ClientType } from '../interfaces';

export class CreateInsuranceDto {
  @ValidateIf((prop) => prop.client_type === 'XP')
  @IsNumber()
  xp_code?: number;

  @ValidateIf((prop) => prop.client_type === 'EXTERNO')
  @IsString()
  cpf?: string;

  @IsString()
  advisor_code: string;

  @IsEnum(ClientType)
  client_type: ClientType;

  @IsString()
  name: string;
}
