import { IsString } from 'class-validator';

export class CreateCompassSolicitationsDto {
  @IsString({ each: true })
  client: number[];

  @IsString()
  advisor_code: string;
}
