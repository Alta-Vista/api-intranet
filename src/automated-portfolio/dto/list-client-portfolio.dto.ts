import { IsString } from 'class-validator';

export class ListClientPortfolioDto {
  @IsString()
  client: string;
}
