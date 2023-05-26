import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import {
  CreateInsuranceClient,
  CreateInsuranceInsurerProduct,
  CreateInsurancePlans,
  FindInsuranceClient,
  ListInsuranceClientsInterface,
  ListInsurancesClientsPlans,
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
    return this.prisma.seguros_clientes.create({
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

  async createInsurer(insurer: string) {
    return this.prisma.seguradoras.create({
      data: {
        seguradora: insurer,
      },
    });
  }

  async createInsurerProduct({
    commission,
    insurer_id,
    product,
  }: CreateInsuranceInsurerProduct) {
    return this.prisma.seguradoras_produtos.create({
      data: {
        comissao_percentual: commission,
        nome: product,
        id_seguradora: insurer_id,
      },
    });
  }

  async createPlansStep(step: string) {
    return this.prisma.seguros_clientes_planos_etapas.create({
      data: {
        etapa: step,
      },
    });
  }

  async createInsurancePlan(data: CreateInsurancePlans) {
    return this.prisma.seguros_clientes_planos.create({
      data: {
        origem_alocacao: data.from_allocation,
        periodicidade: data.frequency,
        cod_a: data.advisor,
        comissao_percentual: data.commission_percentage,
        id_cliente: data.client_id,
        dt_implementacao: data.implemented_at,
        dt_indicacao: data.recommended_at,
        id_consultor: data.consultant_id,
        dt_pagamento: data.paid_at,
        pa: data.pa,
        id_etapa: data.step_id,
        id_produto: data.product_id,
        id_seguradora: data.insurer_id,
        total_comissao: data.total_commission,
        dt_up_plataforma: data.updated_at,
      },
    });
  }

  async findInsurerProduct(product: string, insurer_id: string) {
    return this.prisma.seguradoras_produtos.findFirst({
      where: {
        nome: product,
        id_seguradora: insurer_id,
      },
    });
  }

  async findInsurer(insurer: string) {
    return this.prisma.seguradoras.findUnique({
      where: {
        seguradora: insurer,
      },
    });
  }

  async findClient({ code, cpf, xp_code }: FindInsuranceClient) {
    let where: { cod_interno?: string; cpf?: string; cod_xp?: number };

    if (code) where = { cod_interno: code };

    if (cpf) where = { cpf };

    if (xp_code) where = { cod_xp: xp_code };

    return this.prisma.seguros_clientes.findUnique({
      where,
    });
  }

  async findPlansStep(step: string) {
    return this.prisma.seguros_clientes_planos_etapas.findUnique({
      where: {
        etapa: step,
      },
    });
  }

  async listAllClients({ limit, offset }: ListInsuranceClientsInterface) {
    const skip = limit * offset - limit;

    const clients = await this.prisma.seguros_clientes.findMany({
      skip,
      take: limit,
    });

    const total = await this.totalInsuranceClients();

    return {
      total,
      clients,
    };
  }

  async listBrokerClients({
    limit,
    offset,
    broker_id,
  }: ListInsuranceClientsInterface) {
    const skip = limit * offset - limit;

    const where = {
      planos: {
        every: {
          id_consultor: broker_id,
        },
      },
    };

    const clients = await this.prisma.seguros_clientes.findMany({
      where,
      skip,
      take: limit,
    });

    const total = await this.totalInsuranceClients(where);

    return {
      total,
      clients,
    };
  }

  async listClientsPlans({
    limit,
    offset,
    advisor,
    broker_id,
    client_id,
  }: ListInsurancesClientsPlans) {
    const skip = limit * offset - limit;

    let where: {
      id_cliente: string;
      id_consultor?: string;
      cod_a?: string;
    } = {
      id_cliente: client_id,
    };

    if (advisor) {
      where = {
        id_cliente: client_id,
        cod_a: advisor,
      };
    }

    if (broker_id) {
      where = {
        id_cliente: client_id,
        id_consultor: broker_id,
      };
    }

    const plans = await this.prisma.seguros_clientes_planos.findMany({
      where,
      skip,
      take: limit,
    });

    const total = await this.prisma.seguros_clientes_planos.count({
      where,
    });

    return {
      total,
      plans,
    };
  }

  async totalInsuranceClients(where?: any) {
    if (where) {
      return this.prisma.seguros_clientes.count({
        where,
      });
    }
    return this.prisma.seguros_clientes.count();
  }
}
