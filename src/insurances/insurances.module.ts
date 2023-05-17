import { Module } from '@nestjs/common';
import { InsurancesAdminService } from './services/insurances-admin.service';
import { InsurancesAdminController } from './controllers/insurances-admin.controller';
import { PrismaModule } from '../database/prisma.module';
import { InsuranceRepository } from './insurances.repository';

@Module({
  imports: [PrismaModule],
  controllers: [InsurancesAdminController],
  providers: [InsurancesAdminService, InsuranceRepository],
})
export class InsurancesModule {}
