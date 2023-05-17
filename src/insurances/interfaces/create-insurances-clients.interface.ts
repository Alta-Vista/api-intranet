import { ClientType } from './';

export interface CreateInsuranceClient {
  xp_code?: number;
  cpf?: string;
  int_code?: string;
  advisor_code: string;
  client_type: ClientType;
  name: string;
}
