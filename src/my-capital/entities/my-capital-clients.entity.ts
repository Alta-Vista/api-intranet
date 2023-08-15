import { mycapital_pagador } from 'prisma/prisma-client';

export class Clients {
  id?: string;

  nome: string;

  codigo: number;

  cod_a: string;

  email: string;

  cpf_cnpj: string;

  pagador: mycapital_pagador;

  dt_criacao?: Date;

  dt_atualizacao?: Date;
}
