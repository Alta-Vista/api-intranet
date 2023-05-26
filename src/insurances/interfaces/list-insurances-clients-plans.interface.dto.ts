export interface ListInsurancesClientsPlans {
  limit: number;
  offset: number;
  broker_id?: string;
  advisor?: string;
  client_id: string;
}
