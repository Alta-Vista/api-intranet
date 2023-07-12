import { IsNumber, IsString, IsUUID } from 'class-validator';

export class InviteClientToEventDto {
  @IsNumber()
  client: number;

  @IsUUID()
  event_id: string;

  @IsString()
  advisor: string;
}
