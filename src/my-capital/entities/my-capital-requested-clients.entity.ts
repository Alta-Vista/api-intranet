import { my_capital_pagador, my_capital_status } from 'prisma/prisma-client';

export class RequestedClients {
  id?: string;

  id_solicitacao: string;

  cod_cliente: number;

  id_solicitante: string;

  pagador: my_capital_pagador;

  status: my_capital_status;

  mensagem?: string;

  dt_criacao?: Date;

  dt_atualizacao?: Date;
}
