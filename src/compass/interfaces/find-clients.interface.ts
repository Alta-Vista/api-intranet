export interface FindClientsInterface {
  limit: number;
  offset: number;
  advisor_code?: string;
  is_available?: boolean;
  advisor?: string;
  compass_advisor?: string;
}
