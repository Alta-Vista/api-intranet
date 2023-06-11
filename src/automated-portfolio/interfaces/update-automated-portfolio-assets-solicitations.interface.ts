import { AssetStatus } from './asset-status.interface';

type UpdateAsset = {
  id: string;
  message?: string;
  status: AssetStatus;
};

export interface UpdateAutomatedPortfolioAssetsSolicitations {
  request_id: string;
  assets: UpdateAsset[];
}
