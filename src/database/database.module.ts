import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { RedshiftService } from './redshift.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [PrismaService, RedshiftService],
  exports: [PrismaService, RedshiftService],
})
export class DatabaseModule {}
