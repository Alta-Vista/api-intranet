export interface FindClientsInterface {
  limit: number;
  offset: number;
  collaboratorId?: string;
  isAvailable?: boolean;
  advisor?: string;
  compass_advisor?: string;
}
