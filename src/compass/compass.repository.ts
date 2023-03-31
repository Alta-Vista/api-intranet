import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateCompassClientesSolicitationsDto } from './dto/create-clients-solicitations.dto';
import { ListRequestedClientsInterface } from './interfaces';
import { FindClientsInterface } from './interfaces/find-clients.interface';

@Injectable()
export class CompassRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createSolicitation(requester_id: string) {
    return this.prisma.compass_solicitacoes.create({
      data: {
        id_solicitante: requester_id,
      },
    });
  }

  async createClientsSolicitation(
    data: CreateCompassClientesSolicitationsDto[],
  ) {
    await this.prisma.compass_solicitacoes_clientes.createMany({
      data,
    });
  }

  async listRequestedClients({
    advisor_code,
    limit,
    offset,
    requester_id,
  }: ListRequestedClientsInterface) {
    const skip = limit * offset - limit;

    const requests = await this.prisma.compass_solicitacoes_clientes.findMany({
      orderBy: {
        dt_solicitacao: 'desc',
      },
      where: {
        OR: [
          {
            solicitacao: {
              id_solicitante: requester_id,
            },
          },
          {
            cod_assessor: advisor_code,
          },
        ],
      },
      skip,
      take: limit,
    });

    const total = await this.prisma.compass_solicitacoes_clientes.count({
      where: {
        OR: [
          {
            solicitacao: {
              id_solicitante: requester_id,
            },
          },
          {
            cod_assessor: advisor_code,
          },
        ],
      },
    });

    return {
      total,
      requests,
    };
  }

  async listCompassClients({
    limit,
    offset,
    isAvailable,
    advisor,
    compass_advisor,
  }: FindClientsInterface) {
    const skip = limit * offset - limit;

    let where: unknown = {
      disponivel: isAvailable,
    };

    if (advisor && !compass_advisor) {
      where = {
        disponivel: isAvailable,
        assessor_origem: {
          cod_assessor: advisor,
        },
      };
    }

    if (!advisor && compass_advisor) {
      where = {
        disponivel: isAvailable,
        assessor_compass: {
          cod_assessor: advisor,
        },
      };
    }

    if (advisor && compass_advisor) {
      where = {
        disponivel: isAvailable,
        assessor_compass: {
          cod_assessor: compass_advisor,
        },
        assessor_origem: {
          cod_assessor: advisor,
        },
      };
    }

    const clients = await this.prisma.compass_clientes.findMany({
      select: {
        id: true,
        cd_cliente: true,
        disponivel: true,
        cliente_ciente: true,
        em_devolucao: true,
        patrimonio: true,
        assessor_compass: true,
        assessor_origem: true,
      },
      where,
      skip,
      take: limit,
    });

    const total = await this.prisma.compass_clientes.count();

    return {
      total,
      clients,
    };
  }

  async listAdvisorClients({
    limit,
    offset,
    collaboratorId,
  }: FindClientsInterface) {
    const skip = limit * offset - limit;

    const clients = await this.prisma.compass_clientes.findMany({
      select: {
        id: true,
        cd_cliente: true,
        disponivel: true,
        cliente_ciente: true,
        em_devolucao: true,
        patrimonio: true,
        assessor_compass: true,
        assessor_origem: true,
      },
      where: {
        id_assessor_origem: collaboratorId,
        disponivel: false,
      },
      skip,
      take: limit,
    });

    const total = await this.prisma.compass_clientes.count();

    return {
      total,
      clients,
    };
  }

  async assignClients(client: number, compass_advisor: string) {
    return this.prisma.compass_clientes.update({
      where: {
        cd_cliente: client,
      },
      data: {
        id_assessor_compass: compass_advisor,
        disponivel: false,
        dt_atualizacao: new Date(),
      },
    });
  }
}
