import { HttpStatus, Injectable } from '@nestjs/common';
import { AutomatedPortfolioRepository } from '../automated-portfolio.repository';
import {
  ListClientPortfolioDto,
  CreateAutomatedPortfolioRequestDto,
  ListRequestedAssetsDto,
} from '../dto';
import { ListRequestsDto } from '../dto/list-requests.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AutomatedPortfolioService {
  constructor(
    private automatedPortfolioRepository: AutomatedPortfolioRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(data: CreateAutomatedPortfolioRequestDto, advisorCode?: string) {
    await this.automatedPortfolioRepository.createRequest({
      advisor: data.advisor || advisorCode,
      automated_portfolio_id: data.automated_portfolio_id,
      assets: data.assets,
      client: data.client,
      message: data.message,
    });

    const payload = {
      name: '',
      to: 'caue.glorgiano@altavistainvest.com.br',
      message:
        'Um assessor mandou um novo cliente para a carteira automatizada, para ver o cliente e os ativos, entre na Intranet!',
      subject: '[MESA RV] - Carteira automatizada solicitações',
    };

    this.eventEmitter.emit('notification.send-notification', payload);
  }

  async listClientPortfolio(
    { client }: ListClientPortfolioDto,
    advisor: string,
  ) {
    const findClient = await this.automatedPortfolioRepository.findClientRs(
      client,
    );

    if (!findClient) {
      return {
        code: 'not.found',
        status: HttpStatus.NOT_FOUND,
      };
    }

    if (findClient.advisor !== advisor) {
      return {
        code: 'not.allowed',
        status: HttpStatus.UNAUTHORIZED,
      };
    }

    const clientPortfolio =
      await this.automatedPortfolioRepository.findClientStocksAndReits(client);

    return {
      client,
      portfolio: clientPortfolio,
    };
  }

  async listRequests(
    { limit, offset, client }: ListRequestsDto,
    advisor: string,
  ) {
    const { assets, total } =
      await this.automatedPortfolioRepository.listRequests({
        advisor,
        limit: Number(limit),
        offset: Number(offset),
        client: Number(client),
      });

    return {
      limit,
      page: offset,
      total,
      assets,
    };
  }

  async lisAutomatedPortfolio() {
    return this.automatedPortfolioRepository.listAutomatedPortfolios();
  }

  async listRequestAssets({ request_id }: ListRequestedAssetsDto) {
    return this.automatedPortfolioRepository.listRequestAssets(request_id);
  }
}
