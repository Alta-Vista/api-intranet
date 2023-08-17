import { IsOptional, IsString } from 'class-validator';

export class ListMyCapitalClientsDto {
  @IsString()
  @IsOptional()
  limit: string;

  @IsString()
  @IsOptional()
  offset: string;

  @IsOptional()
  @IsString()
  client?: string;
}
