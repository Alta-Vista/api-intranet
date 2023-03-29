import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateCompassClientesSolicitationsDto } from './dto/create-clients-solicitations.dto';
import { ListRequestedClientsInterface } from './interfaces';

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
}
