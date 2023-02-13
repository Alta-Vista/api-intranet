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
}
