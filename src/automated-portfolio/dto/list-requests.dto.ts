import { IsOptional, IsString } from 'class-validator';

export class ListRequestsDto {
  @IsString()
  @IsOptional()
  limit: number;

  @IsString()
  @IsOptional()
  offset: number;

  @IsString()
  @IsOptional()
  advisor?: string;

  @IsOptional()
  @IsString()
  client?: string;
}
