import { my_capital_status } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class ListMyCapitalRequestedClientsDto {
  @IsString()
  @IsOptional()
  limit: string;

  @IsString()
  @IsOptional()
  offset: string;

  @IsEnum(my_capital_status)
  @IsOptional()
  status?: my_capital_status;

  @IsOptional()
  @IsString()
  client?: string;
}
