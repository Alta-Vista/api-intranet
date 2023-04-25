import { CompassStatus } from './compass-status.interface';

export interface RequestClientBackInterface {
  id?: string;
  requester_id?: string;
  client?: number;
  reason?: string;
  compass_advisor?: string;
  advisor?: string;
  message?: string;
  status?: CompassStatus;
  updated_at?: Date;
  returned_at?: Date;
}
