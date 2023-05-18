import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import {
  CreateInsuranceClient,
  FindInsuranceClient,
  ListInsuranceClientsInterface,
} from './interfaces';
import { CreateInsuranceInsurerProduct } from './interfaces/create-insurance-insurer-product.dto';
import { CreateInsurancePlans } from './interfaces/create-insurance-plans.interface';

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
    return this.prisma.produtos.create({
      data: {
        comissao_percentual: commission,
        nome: product,
        id_seguradora: insurer_id,
      },
    });
  }

  async createPlansStep(step: string) {
    return this.prisma.clientes_planos_etapas.create({
      data: {
        etapa: step,
      },
    });
  }

  async createInsurancePlan(data: CreateInsurancePlans) {
    return this.prisma.clientes_planos.create({
      data: {
        origem_alocacao: data.from_allocation,
        periodicidade: data.frequency,
        cod_a: data.advisor,
        comissao_percentual: data.commission_percentage,
        id_cliente: data.client_id,
        dt_implementacao: data.implemented_at,
        dt_indicacao: data.recommended_at,
        id_consultor: data.insurer_id,
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
    return this.prisma.produtos.findFirst({
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

    return this.prisma.clientes.findUnique({
      where,
    });
  }

  async findPlansStep(step: string) {
    return this.prisma.clientes_planos_etapas.findUniqueOrThrow({
      where: {
        etapa: step,
      },
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

  async totalInsuranceClients() {
    return this.prisma.clientes.count();
  }
}
