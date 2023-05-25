import { RedshiftService } from 'src/database/redshift.service';
import * as dayjs from 'dayjs';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
  CreateAutomatedPortfolioClient,
  CreateAutomatedPortfolioSolicitation,
  ListAutomatedPortfolioRequestedAssets,
} from './interfaces';

@Injectable()
export class AutomatedPortfolioRepository {
  constructor(
    private readonly redshift: RedshiftService,
    private readonly prisma: PrismaService,
  ) {}

  async createClient({ advisor, client }: CreateAutomatedPortfolioClient) {
    return this.prisma.clientes_mesa_rv.create({
      data: {
        cliente: client,
        cod_a: advisor,
      },
    });
  }

  async createClientSolicitation(
    requests: CreateAutomatedPortfolioSolicitation[],
  ) {
    const data = requests.map((request) => ({
      ativo: request.asset,
      carteira_adm: request.is_automated_portfolio,
      cliente: request.client,
      cod_a: request.advisor,
      qtd_atual: request.quantity,
      tipo: request.type,
      total_solicitado: request.solicited_amount,
      valor_total_atual: request.amount,
    }));

    return this.prisma.clientes_solicitacao_ativos.createMany({
      data,
    });
  }

  async findClient(client: number) {
    return this.prisma.clientes_mesa_rv.findUnique({
      where: {
        cliente: client,
      },
    });
  }

  async findClientStocksAndReits(client: string) {
    const date = dayjs().format('YYYY-MM-DD');

    const queryText = `
      SELECT
        fii.ativo AS asset,
        fii.qtd_disp AS quantity,
        fii.financeiro AS amount,
        'FII' AS type
      FROM
        xp_repository.fii fii
      WHERE
        fii.account_xp_code = $1
        AND fii.dt ::date = $2
      UNION
      SELECT
        ac.ativo AS asset,
        ac.qtd_disp AS quantity,
        ac.financeiro AS amount,
        'ACOES' AS type
      FROM
        xp_repository.acoes ac
      WHERE
        ac.account_xp_code = $1
        AND ac.dt ::date = $2;
    `;

    const values = [client, date];

    const { data } = await this.redshift.query(queryText, values);

    return data;
  }

  async findClientRs(
    client: string,
  ): Promise<{ client: string; advisor: string }> {
    const queryText = `
      SELECT
        client.account_xp_code AS client,
        client.cod_a AS advisor
      FROM
        xp_repository.cliente_dados_cadastrais client
      WHERE
        client.account_xp_code = $1;
    `;

    const values = [client];

    const { data } = await this.redshift.query(queryText, values);

    return data[0];
  }

  async listSendedAssets({
    advisor,
    limit,
    offset,
  }: ListAutomatedPortfolioRequestedAssets) {
    const skip = limit * offset - limit;

    let where: {
      cod_a?: string;
    };

    if (advisor) {
      where = {
        cod_a: advisor,
      };
    }

    const assets = await this.prisma.clientes_solicitacao_ativos.findMany({
      where,
      skip,
      take: limit,
    });

    const total = await this.prisma.clientes_solicitacao_ativos.count({
      where,
    });

    return {
      total,
      assets,
    };
  }
}
