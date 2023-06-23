import { CompassStatus } from './compass-status.interface';

export interface UpdateReassignedClientsInterface {
  id: string;
  status: CompassStatus;
  message: string;
  currentCompassAdvisor?: string;
  advisor?: string;
}
