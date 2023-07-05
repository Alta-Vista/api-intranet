import { AssetStatus } from './asset-status.interface';
import { AssetType } from './asset-type.interface';

export interface CreateAutomatedPortfolioSolicitation {
  id?: string;
  request_id?: string;
  asset: string;
  status?: AssetStatus;
  type: AssetType;
  quantity: number;
  amount: number;
  requested_amount: number;
  message?: string;
  position_date: Date;
}
