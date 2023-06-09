import { HttpStatus, Injectable } from '@nestjs/common';
import { AutomatedPortfolioRepository } from '../automated-portfolio.repository';
import {
  ListClientPortfolioDto,
  ListRequestsDto,
  UpdateAutomatedPortfolioDto,
} from '../dto';

@Injectable()
export class AutomatedPortfolioAdminService {
  constructor(
    private automatedPortfolioRepository: AutomatedPortfolioRepository,
  ) {}

  async listClientPortfolio({ client }: ListClientPortfolioDto) {
    const findClient = await this.automatedPortfolioRepository.findClientRs(
      client,
    );

    if (!findClient) {
      return {
        code: 'not.found',
        status: HttpStatus.NOT_FOUND,
      };
    }

    const clientPortfolio =
      await this.automatedPortfolioRepository.findClientStocksAndReits(client);

    return {
      client,
      portfolio: clientPortfolio,
    };
  }

  async listRequests({ limit, offset, advisor, client }: ListRequestsDto) {
    const { assets, total } =
      await this.automatedPortfolioRepository.listRequests({
        limit: Number(limit),
        offset: Number(offset),
        advisor,
        client: Number(client),
      });

    return {
      limit,
      page: offset,
      total,
      assets,
    };
  }

  async listAllRequestedAssets() {
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
