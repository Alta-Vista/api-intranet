import { IsString } from 'class-validator';

export class FindAllClientsDto {
  @IsString()
  readonly limit?: string;

  @IsString()
  readonly offset?: string;
}
