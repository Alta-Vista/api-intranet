import { InsurancePlansFrequency } from './insurance-plans-frequency.interface';

export interface CreateInsurancePlans {
  client_id: string;
  consultant_id: string;
  advisor: string;
  insurer_id: string;
  pi: number;
  frequency: InsurancePlansFrequency;
  product_id: string;
  pa: number;
  from_allocation: boolean;
  commission_percentage: number;
  total_commission: number;
  step_id: string;
  recommended_at: Date;
  implemented_at: Date;
  paid_at: Date;
  updated_at: Date;
}
