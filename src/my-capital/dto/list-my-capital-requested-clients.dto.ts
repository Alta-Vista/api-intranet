import { mycapital_status } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class ListMyCapitalRequestedClientsDto {
  @IsString()
  @IsOptional()
  limit: number;

  @IsString()
  @IsOptional()
  offset: number;

  @IsEnum(mycapital_status)
  @IsOptional()
  status?: mycapital_status;

  @IsOptional()
  @IsString()
  client?: string;
}
