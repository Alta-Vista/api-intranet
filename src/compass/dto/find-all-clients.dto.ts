import { IsString, IsOptional } from 'class-validator';

export class FindAllClientsDto {
  @IsString()
  @IsOptional()
  readonly limit?: string;

  @IsString()
  @IsOptional()
  readonly offset?: string;

  @IsString()
  @IsOptional()
  readonly client?: string;

  @IsString()
  @IsOptional()
  readonly is_available?: string;

  @IsString()
  @IsOptional()
  readonly advisor?: string;

  @IsString()
  @IsOptional()
  readonly compass_advisor?: string;
}
