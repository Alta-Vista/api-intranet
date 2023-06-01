import { RedshiftService } from 'src/database/redshift.service';
import * as dayjs from 'dayjs';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
  AssetStatus,
  CreateAutomatedPortfolioClient,
  ListAutomatedPortfolioRequestedAssets,
} from './interfaces';

@Injectable()
export class AutomatedPortfolioRepository {
  constructor(
    private readonly redshift: RedshiftService,
    private readonly prisma: PrismaService,
  ) {}

  async createRequest({
    advisor,
    client,
    message,
    automated_portfolio_id,
    assets,
  }: CreateAutomatedPortfolioClient) {
    const data = assets.map((request) => ({
      ativo: request.asset,
      status: AssetStatus.SOLICITADO,
      tipo: request.type,
      qtd_atual: request.quantity,
      total_solicitado: request.requested_amount,
      valor_total_atual: request.amount,
      mensagem: 'Solicitação recebida!',
    }));

    return this.prisma.mesa_rv_cart_auto_soli.create({
      data: {
        cliente: client,
        cod_a: advisor,
        id_carteira: automated_portfolio_id,
        mensagem: message,
        dt_atualizacao: new Date(),
        mesa_rv_cart_auto_soli_ativos: {
          createMany: {
            data,
          },
        },
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

    console.log(data);

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

    const assets = await this.prisma.mesa_rv_cart_auto_soli.findMany({
      where,
      skip,
      take: limit,
    });

    const total = await this.prisma.mesa_rv_cart_auto_soli.count({
      where,
    });

    return {
      total,
      assets,
    };
  }

  async listAvailableRequestedAssets() {
    return this.prisma.mesa_rv_cart_auto_soli_ativos.findMany({
      where: {
        status: 'SOLICITADO',
      },
    });
  }

  async listAutomatedPortfolios() {
    return this.prisma.mesa_rv_carteiras_automatizadas.findMany({
      where: {
        ativa: true,
      },
    });
  }
}
