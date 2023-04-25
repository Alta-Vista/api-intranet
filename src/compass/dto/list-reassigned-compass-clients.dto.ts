import { IsOptional, IsString } from 'class-validator';

export class ListReassignedClientsDto {
  @IsString()
  @IsOptional()
  limit: string;

  @IsString()
  @IsOptional()
  offset: string;
}
