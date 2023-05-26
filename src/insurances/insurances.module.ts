import { Module } from '@nestjs/common';
import { InsurancesAdminService } from './services/insurances-admin.service';
import { InsurancesAdminController } from './controllers/insurances-admin.controller';
import { DatabaseModule } from '../database/database.module';
import { InsuranceRepository } from './insurances.repository';
import { ConfigModule } from '@nestjs/config';
import { InsurancesBrokerService } from './services/insurances-broker.service';
import { InsurancesBrokerController } from './controllers/insurances-broker.controller';
import { InsurancesAdvisorService } from './services/insurances-advisor.service';
import { InsurancesAdvisorController } from './controllers/insurances-advisor.controller';

@Module({
  imports: [DatabaseModule, ConfigModule.forRoot()],
  controllers: [
    InsurancesAdminController,
    InsurancesBrokerController,
    InsurancesAdvisorController,
  ],
  providers: [
    InsurancesAdminService,
    InsurancesBrokerService,
    InsurancesAdvisorService,
    InsuranceRepository,
  ],
})
export class InsurancesModule {}
