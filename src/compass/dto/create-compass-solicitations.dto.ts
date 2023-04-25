import { IsString } from 'class-validator';

export class CreateCompassSolicitationsDto {
  @IsString({ each: true })
  clients: number[];

  @IsString()
  advisor_code: string;
}
