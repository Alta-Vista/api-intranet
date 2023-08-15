import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateClientRequest } from './interfaces';

@Injectable()
export class MyCapitalRepository {
  constructor(private prisma: PrismaService) {}

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

  async findMyCapitalClient(code: number) {
    const client = await this.prisma.mycapital_clientes.findUnique({
      where: {
        codigo: code,
      },
    });

    return {
      id: client.id,
      code: client.codigo,
    };
  }

  async findAdvisorClients(advisor: string) {
    return this.prisma.mycapital_clientes.findMany({
      where: {
        cod_a: advisor,
      },
    });
  }
}
