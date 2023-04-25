import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class OfficesRepository {
  constructor(private prisma: PrismaService) {}

  async findOfficeMeA(id: string) {
    return this.prisma.escritorios_aquisicoes.findUnique({
      where: {
        id,
      },
    });
  }

  async listOffices() {
    const data = await this.prisma.filiais.findMany({
      select: {
        id: true,
        cidades: true,
      },
    });

    return data.map((office) => {
      return {
        id: office.id,
        location: office.cidades.cidade,
      };
    });
  }

  async listMaA() {
    return this.prisma.escritorios_aquisicoes.findMany();
  }

  async listTeams() {
    return this.prisma.filiais_equipes.findMany();
  }
}
