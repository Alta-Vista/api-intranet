import { mycapital_status } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

export class UpdateMyCapitalRequestedClientDto {
  @IsUUID()
  request_id: string;

  @IsEnum(mycapital_status)
  status: mycapital_status;

  @IsString()
  @ValidateIf((property) => property.status === 'ERRO')
  @IsNotEmpty({
    message: 'Mensagem é obrigatória',
  })
  error_message?: string;
}
