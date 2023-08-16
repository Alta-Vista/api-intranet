import { mycapital_pagador, mycapital_status } from 'prisma/prisma-client';

export class RequestedClients {
  id?: string;

  id_solicitacao: string;

  cod_cliente: number;

  pagador: mycapital_pagador;

  status: mycapital_status;

  erro?: string;

  dt_criacao?: Date;

  dt_atualizacao?: Date;
}
