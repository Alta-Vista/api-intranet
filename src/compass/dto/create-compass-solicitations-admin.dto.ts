import { Type } from 'class-transformer';
import { IsNumber, IsString, ValidateNested } from 'class-validator';

class Clients {
  @IsNumber()
  client: number;

  @IsString()
  compassAdvisor: string;
}

export class CreateCompassSolicitationAdminsDto {
  @ValidateNested()
  @Type(() => Clients)
  clients: Clients[];

  @IsString()
  advisor_code: string;
}
