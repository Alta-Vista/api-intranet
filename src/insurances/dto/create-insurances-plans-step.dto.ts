import { IsString } from 'class-validator';

export class CreateInsurancePlansStepDto {
  @IsString()
  step: string;
}
