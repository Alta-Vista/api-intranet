import { my_capital_status } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

export class UpdateMyCapitalRequestedClientDto {
  @IsUUID()
  request_id: string;

  @IsEnum(my_capital_status)
  status: my_capital_status;

  @IsString()
  @ValidateIf((property) => property.status === 'ERRO')
  @IsNotEmpty({
    message: 'Mensagem é obrigatória',
  })
  @IsOptional()
  message?: string;
}
