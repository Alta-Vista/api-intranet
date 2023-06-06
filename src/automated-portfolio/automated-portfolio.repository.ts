import { RedshiftService } from 'src/database/redshift.service';
import * as dayjs from 'dayjs';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
  AssetStatus,
  CreateAutomatedPortfolioClient,
  ListAutomatedPortfolioRequestedAssets,
  UpdateAutomatedPortfolioAssetsSolicitations,
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

  async listRequests({
    advisor,
    limit,
    offset,
  }: ListAutomatedPortfolioRequestedAssets) {
    const skip = limit * offset - limit;

    let where: {
      cod_a?: string;
    };

    let assets = await this.prisma.$queryRaw`SELECT
      cas.id,
      cas.cliente AS client,
      cas.cod_a AS advisor, 
      cas.dt_criacao AS requested_at,
      cas.dt_atualizacao AS updated_at,
      portfolio.nome AS portfolio,
      COALESCE(exec_assets.total, 0)::integer AS total_executed,
      COALESCE(pending_assets.total, 0)::integer AS total_pending,
      COALESCE(error_assets.total, 0)::integer AS total_error
    FROM
      mesa_rv.mesa_rv_cart_auto_soli cas
      LEFT JOIN (
        SELECT
          COUNT(a.id_solicitacao) AS total,
          a.id_solicitacao
        FROM
          mesa_rv.mesa_rv_cart_auto_soli_ativos a
        WHERE a.status = 'SUCESSO'
        GROUP BY
          a.id_solicitacao
      ) AS exec_assets ON exec_assets.id_solicitacao = cas.id
      LEFT JOIN (
        SELECT
          COUNT(a.id_solicitacao) AS total,
          a.id_solicitacao
        FROM
          mesa_rv.mesa_rv_cart_auto_soli_ativos a
        WHERE a.status = 'SOLICITADO' OR a.status = 'EM_ANDAMENTO'
        GROUP BY
          a.id_solicitacao
      ) AS pending_assets ON pending_assets.id_solicitacao = cas.id
      LEFT JOIN (
        SELECT
          COUNT(a.id_solicitacao) AS total,
          a.id_solicitacao
        FROM
          mesa_rv.mesa_rv_cart_auto_soli_ativos a
        WHERE a.status = 'ERRO'
        GROUP BY
          a.id_solicitacao
      ) AS error_assets ON error_assets.id_solicitacao = cas.id
      LEFT JOIN mesa_rv.mesa_rv_carteiras_automatizadas AS portfolio ON portfolio.id = cas.id_carteira
    ORDER BY pending_assets.total DESC
    LIMIT ${limit} OFFSET ${skip}`;

    if (advisor) {
      where = {
        cod_a: advisor,
      };
      assets = await this.prisma.$queryRaw`SELECT
        cas.id,
        cas.cliente AS client,
        cas.cod_a AS advisor, 
        cas.dt_criacao AS requested_at,
        cas.dt_atualizacao AS updated_at,
        portfolio.nome AS portfolio,
        COALESCE(exec_assets.total, 0)::integer AS total_executed,
        COALESCE(pending_assets.total, 0)::integer AS total_pending,
        COALESCE(error_assets.total, 0)::integer AS total_error
      FROM
        mesa_rv.mesa_rv_cart_auto_soli cas
        LEFT JOIN (
          SELECT
            COUNT(a.id_solicitacao) AS total,
            a.id_solicitacao
          FROM
            mesa_rv.mesa_rv_cart_auto_soli_ativos a
          WHERE a.status = 'SUCESSO'
          GROUP BY
            a.id_solicitacao
        ) AS exec_assets ON exec_assets.id_solicitacao = cas.id
        LEFT JOIN (
          SELECT
            COUNT(a.id_solicitacao) AS total,
            a.id_solicitacao
          FROM
            mesa_rv.mesa_rv_cart_auto_soli_ativos a
          WHERE a.status = 'SOLICITADO' OR a.status = 'EM_ANDAMENTO'
          GROUP BY
            a.id_solicitacao
        ) AS pending_assets ON pending_assets.id_solicitacao = cas.id
        LEFT JOIN (
          SELECT
            COUNT(a.id_solicitacao) AS total,
            a.id_solicitacao
          FROM
            mesa_rv.mesa_rv_cart_auto_soli_ativos a
          WHERE a.status = 'ERRO'
          GROUP BY
            a.id_solicitacao
        ) AS error_assets ON error_assets.id_solicitacao = cas.id
        LEFT JOIN mesa_rv.mesa_rv_carteiras_automatizadas AS portfolio ON portfolio.id = cas.id_carteira
      WHERE
        cas.cod_a = ${advisor}
      ORDER BY cas.dt_atualizacao DESC
      LIMIT ${limit} OFFSET ${skip}`;
    }

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

  async listRequestAssets(id: string) {
    return this.prisma.mesa_rv_cart_auto_soli.findUnique({
      where: {
        id,
      },
      include: {
        carteiras: true,
        mesa_rv_cart_auto_soli_ativos: true,
      },
    });
  }

  async updateManyAssetsRequest({
    request_id,
    assets,
  }: UpdateAutomatedPortfolioAssetsSolicitations) {
    assets.forEach(async (asset) => {
      await this.prisma.mesa_rv_cart_auto_soli_ativos.update({
        where: {
          id: asset.id,
        },
        data: {
          status: asset.status,
          mensagem:
            asset.status === 'ERRO' ? asset.message : 'Ativo executado!',
        },
      });
    });

    await this.prisma.mesa_rv_cart_auto_soli.update({
      where: {
        id: request_id,
      },
      data: {
        dt_atualizacao: new Date(),
      },
    });
  }
}
