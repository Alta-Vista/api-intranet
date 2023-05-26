import { IsString } from 'class-validator';

export class CreateInsuranceInsurerDto {
  @IsString()
  insurer: string;
}
