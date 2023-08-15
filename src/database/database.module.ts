import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { RedshiftService } from './redshift.service';
import { ConfigModule } from '@nestjs/config';
import { KnexService } from './knex.service';

@Module({
  imports: [ConfigModule],
  providers: [PrismaService, RedshiftService, KnexService],
  exports: [PrismaService, RedshiftService, KnexService],
})
export class DatabaseModule {}
