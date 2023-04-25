import { IsNumber, IsString, IsUUID } from 'class-validator';

export class AssignCompassClientsDto {
  @IsString()
  compass_advisor: string;

  @IsNumber()
  client: string;

  @IsUUID()
  solicitation_id: string;
}
