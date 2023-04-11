import { Type } from 'class-transformer';
import { IsString, IsNumber, IsArray, ValidateNested } from 'class-validator';

class ReassignCompassClientsType {
  @IsNumber()
  client: number;

  @IsString()
  advisor: string;
}

export class ReassignCompassClientsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReassignCompassClientsType)
  requests: ReassignCompassClientsType[];
}
