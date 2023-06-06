import { Injectable } from '@nestjs/common';
import { AutomatedPortfolioRepository } from '../automated-portfolio.repository';
import { ListRequestsDto, UpdateAutomatedPortfolioDto } from '../dto';

@Injectable()
export class AutomatedPortfolioAdminService {
  constructor(
    private automatedPortfolioRepository: AutomatedPortfolioRepository,
  ) {}

  async listRequestes({ limit, offset, advisor }: ListRequestsDto) {
    const { assets, total } =
      await this.automatedPortfolioRepository.listRequests({
        limit: Number(limit),
        offset: Number(offset),
        advisor,
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

  async updateRequestedAssets({
    request_id,
    assets,
  }: UpdateAutomatedPortfolioDto) {
    return this.automatedPortfolioRepository.updateManyAssetsRequest({
      assets,
      request_id,
    });
  }
}
