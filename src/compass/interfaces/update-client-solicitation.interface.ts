import { CompassStatus } from './compass-status.interface';

export interface UpdateClientSolicitation {
  id: string;
  message: string;
  status: CompassStatus;
  updated_at: Date;
}
