import { CreateClientRequest } from './create-client-request.interface';

export interface ListMyCapitalRequestedClientsInterface
  extends Partial<CreateClientRequest> {
  offset: number;
  limit: number;
}
