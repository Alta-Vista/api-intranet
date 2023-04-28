import { IsNumber, IsString } from 'class-validator';

export class CreateCompassSolicitationsDto {
  @IsNumber({}, { each: true })
  clients: number[];

  @IsString()
  advisor_code: string;
}
