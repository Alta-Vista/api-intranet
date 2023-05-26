import { IsOptional, IsString } from 'class-validator';

export class ListInsurancesPlansDto {
  @IsOptional()
  @IsString()
  broker_id?: string;

  @IsString()
  @IsOptional()
  advisor?: string;

  @IsString()
  client_id: string;

  @IsString()
  @IsOptional()
  limit?: string;

  @IsString()
  @IsOptional()
  offset?: string;
}
