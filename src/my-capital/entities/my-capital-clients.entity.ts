import { my_capital_pagador } from 'prisma/prisma-client';
import { RequestedClients } from './my-capital-requested-clients.entity';

export class MyCapitalClients {
  id?: string;

  nome: string;

  codigo: number;

  cod_assessor: string;

  email: string;

  cpf_cnpj: string;

  pagador: my_capital_pagador;

  dt_criacao?: Date;

  dt_atualizacao?: Date;

  solicitacao?: RequestedClients;
}
