import { IsOptional, IsString } from 'class-validator';

export class ListCollaboratorsDto {
  @IsString()
  @IsOptional()
  limit: number;

  @IsString()
  @IsOptional()
  offset: number;
}
