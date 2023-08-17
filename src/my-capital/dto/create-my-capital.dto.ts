import { my_capital_pagador } from '@prisma/client';
import { IsEnum, IsNumber } from 'class-validator';

export class CreateMyCapitalDto {
  @IsNumber()
  client: number;

  @IsEnum(my_capital_pagador)
  payer: my_capital_pagador;
}
