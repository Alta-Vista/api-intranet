import { Injectable } from '@nestjs/common';
import { AutomatedPortfolioRepository } from '../automated-portfolio.repository';
import { ListRequestedAssetsDto } from '../dto';

@Injectable()
export class AutomatedPortfolioAdminService {
  constructor(
    private automatedPortfolioRepository: AutomatedPortfolioRepository,
  ) {}

  async listRequestedAssets({ limit, offset }: ListRequestedAssetsDto) {
    const { assets, total } =
      await this.automatedPortfolioRepository.listSendedAssets({
        limit: Number(limit),
        offset: Number(offset),
      });

    return {
      limit,
      page: offset,
      total,
      assets,
    };
  }

  async generateAvailableAssetsCSV() {
    const data =
      await this.automatedPortfolioRepository.listAvailableRequestedAssets();

    return data;
  }
}
