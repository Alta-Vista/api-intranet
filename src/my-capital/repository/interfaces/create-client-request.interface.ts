import { my_capital_pagador, my_capital_status } from '@prisma/client';

export interface CreateClientRequest {
  id?: string;
  request_id: string;
  client: number;
  payer: my_capital_pagador;
  status?: my_capital_status;
  message: string;
  requester_id: string;
}
