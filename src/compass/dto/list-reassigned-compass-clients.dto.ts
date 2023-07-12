import { IsEnum, IsOptional, IsString, ValidateIf } from 'class-validator';
import { CompassStatus } from '../interfaces';

export class ListReassignedClientsDto {
  @IsOptional()
  @IsString()
  limit: string;

  @IsOptional()
  @IsString()
  offset: string;

  @IsOptional()
  @ValidateIf((property) => property.status !== '')
  @IsEnum(CompassStatus)
  status: CompassStatus | null;

  @IsString()
  @IsOptional()
  client: string;
}
