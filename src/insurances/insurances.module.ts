import { Module } from '@nestjs/common';
import { InsurancesAdminService } from './services/insurances-admin.service';
import { InsurancesAdminController } from './controllers/insurances-admin.controller';
import { DatabaseModule } from '../database/database.module';
import { InsuranceRepository } from './insurances.repository';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [DatabaseModule, ConfigModule.forRoot()],
  controllers: [InsurancesAdminController],
  providers: [InsurancesAdminService, InsuranceRepository],
})
export class InsurancesModule {}
