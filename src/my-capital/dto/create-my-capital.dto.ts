import { mycapital_pagador } from '@prisma/client';
import { IsEnum, IsNumber } from 'class-validator';

export class CreateMyCapitalDto {
  @IsNumber()
  client: number;

  @IsEnum(mycapital_pagador)
  payer: mycapital_pagador;
}
