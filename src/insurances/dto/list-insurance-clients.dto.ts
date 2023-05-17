import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ClientType } from '../interfaces';

export class ListInsuranceInsuranceDto {
  @IsNumber()
  @IsOptional()
  xp_code?: string;

  @IsString()
  @IsOptional()
  cpf?: string;

  @IsString()
  @IsOptional()
  advisor_code?: string;

  @IsEnum(ClientType)
  @IsOptional()
  client_type?: ClientType;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  readonly limit?: string;

  @IsString()
  @IsOptional()
  readonly offset?: string;
}
