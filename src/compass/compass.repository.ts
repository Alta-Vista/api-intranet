import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateCompassClientesSolicitationsDto } from './dto/create-clients-solicitations.dto';

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
}
