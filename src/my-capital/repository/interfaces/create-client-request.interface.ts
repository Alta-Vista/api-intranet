import { mycapital_pagador, mycapital_status } from '@prisma/client';

export interface CreateClientRequest {
  id?: string;
  request_id?: string;
  client?: number;
  payer?: mycapital_pagador;
  status?: mycapital_status;
  error?: string;
}
