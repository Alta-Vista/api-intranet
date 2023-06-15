import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

class AssignCompassClientsType {
  @IsNumber()
  code: number;

  @IsString()
  advisor: string;

  @IsUUID()
  request_id: string;
}

export class AssignCompassClientsDto {
  @IsString()
  compass_advisor: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AssignCompassClientsType)
  clients: AssignCompassClientsType[];
}
