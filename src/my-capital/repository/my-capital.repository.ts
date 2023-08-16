import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  CreateClientRequest,
  CreateMyCapitalClient,
  GetRedshiftClient,
} from './interfaces';
import { KnexService } from '../../database/knex.service';

@Injectable()
export class MyCapitalRepository {
  constructor(
    private prisma: PrismaService,
    private knexService: KnexService,
  ) {}

  async createRequest(requesterId: string) {
    return this.prisma.mycapital_solicitacoes.create({
      data: {
        id_solicitante: requesterId,
      },
    });
  }

  async createClientSolicitation(data: CreateClientRequest) {
    return this.prisma.mycapital_clientes_solicitacoes.create({
      data: {
        cod_cliente: data.client,
        pagador: data.payer,
        erro: data.error,
        id_solicitacao: data.request_id,
        status: data.status,
      },
    });
  }

  async createMyCapitalClient(data: CreateMyCapitalClient) {
    await this.prisma.mycapital_clientes.create({
      data: {
        codigo: data.client_code,
        cpf_cnpj: data.document_id,
        email: data.email,
        nome: data.name,
        pagador: data.payer,
        cod_a: data.advisor,
        id_cliente_solicitacao: data.requested_client_id,
      },
    });
  }

  async findMyCapitalClient(client: number) {
    return await this.prisma.mycapital_clientes.findUnique({
      where: {
        codigo: client,
      },
    });
  }

  async findAdvisorClients(advisor: string) {
    return this.prisma.mycapital_clientes.findMany({
      where: {
        cod_a: advisor,
      },
    });
  }

  async getClientRequestById(id: string) {
    return this.prisma.mycapital_clientes_solicitacoes.findUnique({
      where: {
        id,
      },
    });
  }

  async getRedshiftClient(client: number): Promise<GetRedshiftClient> {
    const rsClient = await this.knexService
      .queryKnex()
      .select('account_xp_code', 'email', 'cod_a', 'cpf_cnpj', 'nome')
      .withSchema('xp_repository')
      .from('cliente_dados_cadastrais')
      .where('account_xp_code', String(client));

    return {
      advisor: rsClient[0].cod_a,
      client: rsClient[0].account_xp_code,
      document_id: rsClient[0].cpf_cnpj,
      email: rsClient[0].email,
      name: rsClient[0].nome,
    };
  }

  async listAllRequestedClients() {
    return this.prisma.mycapital_clientes_solicitacoes.findMany();
  }

  async updateRequestedClient(data: CreateClientRequest) {
    await this.prisma.mycapital_clientes_solicitacoes.update({
      data: {
        cod_cliente: data.client,
        dt_atualizacao: new Date(),
        erro: data.error,
        status: data.status,
      },
      where: {
        id: data.id,
      },
    });
  }
}
