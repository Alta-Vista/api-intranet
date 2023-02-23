import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

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
    return this.prisma.filiais.findMany({
      select: {
        id: true,
        cidades: true,
      },
    });
  }

  async listMaA() {
    return this.prisma.escritorios_aquisicoes.findMany();
  }

  async listTeams() {
    return this.prisma.filiais_equipes.findMany();
  }
}
