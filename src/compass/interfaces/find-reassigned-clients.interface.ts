import { CompassStatus } from './compass-status.interface';

export interface ListReassignedClientsInterface {
  limit: number;
  offset: number;
  status?: CompassStatus;
  client?: number;
}
