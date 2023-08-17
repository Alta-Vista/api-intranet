import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  CreateClientRequest,
  CreateMyCapitalClient,
  GetRedshiftClient,
  ListMyCapitalClientsInterface,
} from './interfaces';
import { KnexService } from '../../database/knex.service';
import { Prisma } from '@prisma/client';
import { UpdateClientRequestInterface } from './interfaces/update-client-request.interface';
import { ListMyCapitalRequestedClientsInterface } from './interfaces/list-my-capital-requested-clients.interface';

@Injectable()
export class MyCapitalRepository {
  constructor(
    private prisma: PrismaService,
    private knexService: KnexService,
  ) {}

  async createRequest(requesterId: string) {
    return this.prisma.my_capital_solicitacoes.create({
      data: {
        id_solicitante: requesterId,
      },
    });
  }

  async createClientSolicitation(data: CreateClientRequest) {
    return this.prisma.my_capital_clientes_solicitacoes.create({
      data: {
        cod_cliente: data.client,
        pagador: data.payer,
        mensagem: data.message,
        id_solicitacao: data.request_id,
        status: data.status,
        id_solicitante: data.requester_id,
      },
    });
  }

  async createMyCapitalClient(data: CreateMyCapitalClient) {
    await this.prisma.my_capital_clientes.create({
      data: {
        codigo: data.client_code,
        cpf_cnpj: data.document_id,
        email: data.email,
        nome: data.name,
        pagador: data.payer,
        cod_assessor: data.advisor,
        id_cliente_solicitacao: data.requested_client_id,
      },
    });
  }

  async findMyCapitalClient(client: number) {
    return await this.prisma.my_capital_clientes.findUnique({
      where: {
        codigo: client,
      },
    });
  }

  async findAdvisorClients(data: ListMyCapitalClientsInterface) {
    const skip = data.limit * data.offset - data.limit;

    return this.prisma.my_capital_clientes.findMany({
      where: {
        cod_assessor: data.advisor,
      },
      skip,
      take: data.limit,
    });
  }

  async getClientRequestById(id: string) {
    return this.prisma.my_capital_clientes_solicitacoes.findUnique({
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

  async listAdvisorRequestedClients({
    limit,
    offset,
    status,
    requester_id,
  }: ListMyCapitalRequestedClientsInterface) {
    const skip = limit * offset - limit;

    let find: Prisma.my_capital_clientes_solicitacoesFindManyArgs = {
      skip,
      take: limit,
      where: {
        id_solicitante: requester_id,
      },
    };

    if (status) {
      find = {
        where: {
          status,
        },
      };
    }

    return this.prisma.my_capital_clientes_solicitacoes.findMany(find);
  }

  async listAllMyCapitalClients({
    limit,
    offset,
    status,
  }: ListMyCapitalRequestedClientsInterface) {
    const skip = limit * offset - limit;

    let find: Prisma.my_capital_clientesFindManyArgs = {
      skip,
      take: limit,
    };

    if (status) {
      find = {
        where: {
          cliente_solicitacao: {
            status,
          },
        },
      };
    }

    return this.prisma.my_capital_clientes.findMany(find);
  }

  async updateRequestedClient(data: UpdateClientRequestInterface) {
    return this.prisma.my_capital_clientes_solicitacoes.update({
      data: {
        cod_cliente: data.client,
        dt_atualizacao: new Date(),
        mensagem: data.message,
        status: data.status,
      },
      where: {
        id: data.id,
      },
    });
  }
}
