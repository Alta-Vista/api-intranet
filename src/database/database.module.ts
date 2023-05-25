import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { RedshiftService } from './redshift.service';

@Module({
  providers: [PrismaService, RedshiftService],
  exports: [PrismaService, RedshiftService],
})
export class DatabaseModule {}
