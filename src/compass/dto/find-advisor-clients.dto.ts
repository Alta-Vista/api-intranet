import { IsOptional, IsString } from 'class-validator';

export class FindAdvisorClientsDto {
  @IsString()
  @IsOptional()
  readonly limit?: string;

  @IsString()
  @IsOptional()
  readonly offset?: string;

  @IsString()
  @IsOptional()
  readonly client?: string;
}
