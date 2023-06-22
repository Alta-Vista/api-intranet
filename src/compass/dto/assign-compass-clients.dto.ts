import { Type } from 'class-transformer';
import { IsNumber, IsString, IsUUID, ValidateNested } from 'class-validator';

class AssignCompassClients {
  @IsNumber()
  code: number;

  @IsUUID()
  request_id: string;

  @IsString()
  advisor: string;
}

export class AssignCompassClientsDto {
  @IsString()
  compass_advisor: string;

  @ValidateNested()
  @Type(() => AssignCompassClients)
  clients: AssignCompassClients[];
}
