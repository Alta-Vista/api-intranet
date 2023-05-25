import { AssetType } from './asset-type.interface';

export interface CreateAutomatedPortfolioSolicitation {
  client: number;
  advisor: string;
  asset: string;
  type: AssetType;
  quantity: number;
  amount: number;
  is_automated_portfolio: boolean;
  solicited_amount: number;
}
