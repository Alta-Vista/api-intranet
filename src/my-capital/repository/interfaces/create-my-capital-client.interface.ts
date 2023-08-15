import { mycapital_pagador } from '@prisma/client';

export interface CreateMyCapitalClient {
  requested_client_id: string;
  name: string;
  client_code: number;
  advisor: string;
  email: string;
  document_id: string;
  payer: mycapital_pagador;
}
