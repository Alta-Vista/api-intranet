import { CreateMyCapitalClient } from './create-my-capital-client.interface';

export interface ListMyCapitalClientsInterface
  extends Partial<CreateMyCapitalClient> {
  offset: number;
  limit: number;
}
