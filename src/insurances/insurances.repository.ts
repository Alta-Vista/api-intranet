import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import {
  CreateInsuranceClient,
  FindInsuranceClient,
  ListInsuranceClientsInterface,
} from './interfaces';

@Injectable()
export class InsuranceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createInsuranceClient({
    advisor_code,
    client_type,
    cpf,
    xp_code,
    int_code,
    name,
  }: CreateInsuranceClient) {
    return this.prisma.clientes.create({
      data: {
        cpf,
        cod_xp: xp_code,
        cod_interno: int_code,
        tp_cliente: client_type,
        cod_a: advisor_code,
        nome: name,
      },
    });
  }

  async totalInsuranceClients() {
    return this.prisma.clientes.count();
  }

  async findClient({ code, cpf, xp_code }: FindInsuranceClient) {
    let where: { cod_interno?: string; cpf?: string; cod_xp?: number };

    if (code) where = { cod_interno: code };

    if (cpf) where = { cpf };

    if (xp_code) where = { cod_xp: xp_code };

    return this.prisma.clientes.findUnique({
      where,
    });
  }

  async listAllClients({ limit, offset }: ListInsuranceClientsInterface) {
    const skip = limit * offset - limit;

    const clients = await this.prisma.clientes.findMany({
      skip,
      take: limit,
    });

    const total = await this.totalInsuranceClients();

    return {
      total,
      clients,
    };
  }
}
