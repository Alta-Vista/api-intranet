import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateCompassClientsSolicitationsDto } from './dto/create-clients-solicitations.dto';
import {
  ListRequestedClientsInterface,
  ReassignClientsInterface,
  FindClientsInterface,
  ListReassignedClientsInterface,
  UpdateClientSolicitation,
  RequestClientBackInterface,
  UpdateReassignedClientsInterface,
} from './interfaces';
import { CompassStatus } from './interfaces';
import { UpdateCompassClientInterface } from './interfaces/update-compass-client.interface';
import { ListRequestedBackClientsInterface } from './interfaces/list-requested-back-clients.interface';
import { Prisma } from '@prisma/client';

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
    data: CreateCompassClientsSolicitationsDto[],
  ) {
    return this.prisma.compass_solicitacoes_clientes.createMany({
      data,
    });
  }

  async createRequestClientBack({
    client,
    reason,
    requester_id,
    compass_advisor,
    advisor,
  }: RequestClientBackInterface) {
    return this.prisma.compass_clientes_devolucao.create({
      data: {
        cod_a_compass: compass_advisor,
        cod_a_origem: advisor,
        motivo: reason,
        status: CompassStatus.SOLICITADO,
        cliente: client,
        id_solicitante: requester_id,
      },
    });
  }

  async deleteCompassClients(client: number) {
    return this.prisma.clientes_compass.delete({
      where: {
        cliente: client,
      },
    });
  }

  async findClientSolicitationById(id: string) {
    return this.prisma.compass_solicitacoes_clientes.findUnique({
      where: {
        id,
      },
    });
  }

  async findReassignedClientsByRequestId(requestId: string) {
    return this.prisma.compass_reatribuicoes_clientes.findMany({
      where: {
        id_solicitacao: requestId,
      },
    });
  }

  async findCompassClient(client: number) {
    return this.prisma.clientes_compass.findUnique({
      where: {
        cliente: client,
      },
    });
  }

  async findRequestedBackClientById(requestId: string) {
    return this.prisma.compass_clientes_devolucao.findUnique({
      where: {
        id: requestId,
      },
      include: {
        assessor_origem: true,
      },
    });
  }

  async findCompassAdvisorByAdvisorCode(code: string) {
    return this.prisma.usuarios.findFirst({
      where: {
        cod_assessor: code,
        colaboradores_informacoes: {
          funcao: {
            funcao: 'Assessor compass',
          },
        },
      },
    });
  }

  async getCompassData() {
    const totalWealthAndClients = await this.prisma.clientes_compass.aggregate({
      _count: {
        cliente: true,
      },
      _sum: {
        patrimonio_xp: true,
      },
    });

    const totalReturns = await this.prisma.compass_clientes_devolucao.count({
      where: {
        status: 'ATRIBUIDO',
      },
    });

    const pendingClients =
      await this.prisma.compass_solicitacoes_clientes.count({
        where: {
          status: 'SOLICITADO',
        },
      });

    const totalAdvisors = await this.prisma.usuarios.count({
      where: {
        colaboradores_informacoes: {
          funcao: {
            funcao: 'Assessor compass',
          },
        },
      },
    });

    return {
      totalWealthAndClients,
      totalReturns,
      pendingClients,
      totalAdvisors,
    };
  }

  async getReassignmentsTargetAdvisor(requestId: string) {
    return this.prisma.compass_reatribuicoes_clientes.groupBy({
      by: ['cod_a_destino'],
      where: {
        id_solicitacao: requestId,
        status: 'ATRIBUIDO',
      },
    });
  }

  async getReassignmentsTargetAdvisorClients(
    requestId: string,
    advisorCode: string,
  ) {
    const clients = await this.prisma.compass_reatribuicoes_clientes.findMany({
      where: {
        id_solicitacao: requestId,
        cod_a_destino: advisorCode,
        status: 'ATRIBUIDO',
      },
      select: {
        cod_a_destino: true,
        cliente: true,
        assessor_origem: {
          select: {
            nome: true,
            sobrenome: true,
          },
        },
      },
    });

    return clients.map((client) => ({
      code: client.cliente,
      advisor: `${client.assessor_origem.nome} ${client.assessor_origem.sobrenome}`,
      targetAdvisor: client.cod_a_destino,
    }));
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
        dt_atualizacao: 'desc',
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
    is_available,
    advisor,
    compass_advisor,
  }: FindClientsInterface) {
    const skip = limit * offset - limit;

    let where: {
      disponivel: boolean;
      cod_a_compass?: string;
      cod_a_origem?: string;
    } = {
      disponivel: is_available,
    };

    if (advisor && !compass_advisor) {
      where = {
        disponivel: is_available,
        cod_a_origem: advisor,
      };
    }

    if (!advisor && compass_advisor) {
      where = {
        disponivel: is_available,
        cod_a_compass: compass_advisor,
      };
    }

    if (advisor && compass_advisor) {
      where = {
        disponivel: is_available,
        cod_a_compass: compass_advisor,
        cod_a_origem: advisor,
      };
    }

    const clients = await this.prisma.clientes_compass.findMany({
      where,
      include: {
        assessor_origem: true,
        assessor_compass: true,
      },
      skip,
      take: limit,
    });

    const total = await this.prisma.clientes_compass.count({
      where,
    });

    return {
      total,
      clients,
    };
  }

  async listAdvisorClients({
    limit,
    offset,
    advisor_code,
    client,
  }: FindClientsInterface) {
    const skip = limit * offset - limit;

    let where: {
      cod_a_origem: string;
      cliente?: number;
      disponivel: boolean;
    } = {
      cod_a_origem: advisor_code,
      disponivel: false,
    };

    if (!isNaN(client) && client !== 0) {
      where = {
        cod_a_origem: advisor_code,
        cliente: client,
        disponivel: false,
      };
    }

    const clients = await this.prisma.clientes_compass.findMany({
      where,
      include: {
        assessor_compass: true,
        assessor_origem: true,
      },
      skip,
      take: limit,
    });

    const total = await this.prisma.clientes_compass.count({
      where,
    });

    const { _sum } = await this.prisma.clientes_compass.aggregate({
      _sum: {
        patrimonio_xp: true,
      },
      where: {
        cod_a_origem: advisor_code,
        disponivel: false,
      },
    });

    return {
      total,
      clients,
      wealth: Number(_sum.patrimonio_xp),
    };
  }

  async listCompassAdvisorClients({
    limit,
    offset,
    compass_advisor,
    client,
  }: FindClientsInterface) {
    const skip = limit * offset - limit;

    let where: {
      cod_a_compass: string;
      disponivel: false;
      cliente?: number;
    } = {
      cod_a_compass: compass_advisor,
      disponivel: false,
    };

    if (client && !isNaN(client)) {
      where = {
        cod_a_compass: compass_advisor,
        disponivel: false,
        cliente: client,
      };
    }

    const clients = await this.prisma.clientes_compass.findMany({
      where,
      include: {
        assessor_origem: true,
        assessor_compass: true,
      },
      skip,
      take: limit,
    });

    const total = await this.prisma.clientes_compass.count({
      where,
    });

    const { _sum } = await this.prisma.clientes_compass.aggregate({
      _sum: {
        patrimonio_xp: true,
      },
      where: {
        cod_a_compass: compass_advisor,
        disponivel: false,
      },
    });

    return {
      total,
      clients,
      wealth: Number(_sum.patrimonio_xp),
    };
  }

  async listCompassAdvisorsReturnedClients({
    advisor,
    limit,
    offset,
    client,
  }: ListRequestedBackClientsInterface) {
    const skip = limit * offset - limit;

    let where: {
      cod_a_compass: string;
      status: CompassStatus;
      cliente?: number;
    } = {
      cod_a_compass: advisor,
      status: CompassStatus.ATRIBUIDO,
    };

    if (client && !isNaN(client)) {
      where = {
        cod_a_compass: advisor,
        status: CompassStatus.ATRIBUIDO,
        cliente: client,
      };
    }

    const requests = await this.prisma.compass_clientes_devolucao.findMany({
      where,
      orderBy: {
        dt_devolucao: 'desc',
      },
      skip,
      take: limit,
    });

    const total = await this.prisma.compass_clientes_devolucao.count({
      where,
    });

    return {
      total,
      requests,
    };
  }

  async listAdvisorRequestedBackClients({
    advisor,
    limit,
    offset,
  }: ListRequestedBackClientsInterface) {
    const skip = limit * offset - limit;

    const requests = await this.prisma.compass_clientes_devolucao.findMany({
      where: {
        cod_a_origem: advisor,
      },
      skip,
      take: limit,
    });

    const total = await this.prisma.compass_clientes_devolucao.count({
      where: {
        cod_a_origem: advisor,
      },
    });

    return {
      total,
      requests,
    };
  }

  async listAllRequestedBackClients({
    limit,
    offset,
  }: ListRequestedBackClientsInterface) {
    const skip = limit * offset - limit;

    const requests = await this.prisma.compass_clientes_devolucao.findMany({
      skip,
      orderBy: {
        dt_solicitacao: 'desc',
      },
      take: limit,
    });

    const total = await this.prisma.compass_clientes_devolucao.count();

    return {
      total,
      requests,
    };
  }

  async listCompassAdvisors() {
    const advisors = await this.prisma.$queryRaw(
      Prisma.sql`
      SELECT
        c.id,
        c.nome,
        c.sobrenome,
        c.cod_assessor,
        c.cod_interno,
        COALESCE(COUNT(cc.cliente),0) total_clientes,
        COALESCE(SUM(cc.patrimonio_xp), 0) total_pl
      FROM
        usuarios.usuarios c
        LEFT JOIN usuarios.colaboradores_informacoes ci ON c.id = ci.id_colaborador
        LEFT JOIN usuarios.colaboradores_funcoes cf ON ci.id_funcao = cf.id
        LEFT JOIN compass.clientes_compass cc ON cc.cod_a_compass = c.cod_assessor
      WHERE
        cf.funcao = 'Assessor compass'
      GROUP BY
        (
          c.id,
          c.nome,
          c.sobrenome,
          c.cod_assessor,
          c.cod_interno
      )
      ORDER BY total_pl DESC;
      `,
    );

    return advisors;
  }

  async listReassignedClients({
    limit,
    offset,
  }: ListReassignedClientsInterface) {
    const skip = limit * offset - limit;

    const requests = await this.prisma.compass_reatribuicoes_clientes.findMany({
      orderBy: {
        dt_solicitacao: 'asc',
      },
      skip,
      take: limit,
    });

    const total = await this.prisma.compass_reatribuicoes_clientes.count();

    return {
      total,
      requests,
    };
  }

  async reassignClients(data: ReassignClientsInterface[]) {
    await this.prisma.compass_reatribuicoes_clientes.createMany({
      data,
    });
  }

  async updateCompassClient(data: UpdateCompassClientInterface) {
    return this.prisma.clientes_compass.update({
      data: {
        cod_a_compass: data.advisor_compass,
        cod_a_origem: data.advisor,
        disponivel: data.available,
        em_devolucao: data.is_returning,
      },
      where: {
        cliente: data.client,
      },
    });
  }

  async updateRequestedBackClients({
    message,
    returned_at,
    status,
    updated_at,
    id,
  }: RequestClientBackInterface) {
    return this.prisma.compass_clientes_devolucao.update({
      data: {
        mensagem: message,
        dt_devolucao: returned_at,
        status,
        dt_atualizacao: updated_at,
      },
      where: {
        id,
      },
    });
  }

  async updateClientSolicitation({
    id,
    message,
    status,
    updated_at,
  }: UpdateClientSolicitation) {
    return this.prisma.compass_solicitacoes_clientes.update({
      where: {
        id,
      },
      data: {
        status,
        mensagem: message,
        dt_atualizacao: updated_at,
      },
    });
  }

  async updateReassignedClients({
    id,
    message,
    status,
    currentCompassAdvisor,
    advisor,
  }: UpdateReassignedClientsInterface) {
    return this.prisma.compass_reatribuicoes_clientes.update({
      where: {
        id,
      },
      data: {
        mensagem: message,
        cod_a_origem: advisor,
        cod_a_compass: currentCompassAdvisor,
        status,
        dt_atualizacao: new Date(),
      },
    });
  }
}
