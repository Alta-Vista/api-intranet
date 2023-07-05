import { CreateAutomatedPortfolioSolicitation } from './create-automated-portfolio-solicitation.interface';

export interface CreateAutomatedPortfolioClient {
  client: number;
  automated_portfolio_id: string;
  message?: string;
  advisor: string;
  assets: CreateAutomatedPortfolioSolicitation[];
}
