import { Module } from '@nestjs/common';
import { AutomatedPortfolioService } from './services/automated-portfolio.service';
import { AutomatedPortfolioController } from './controllers/automated-portfolio.controller';
import { DatabaseModule } from '../database/database.module';
import { AutomatedPortfolioRepository } from './automated-portfolio.repository';
import { AutomatedPortfolioAdminController } from './controllers/automated-portfolio-admin.controller';
import { AutomatedPortfolioAdminService } from './services/automated-portfolio-admin.service';

@Module({
  imports: [DatabaseModule],
  controllers: [
    AutomatedPortfolioController,
    AutomatedPortfolioAdminController,
  ],
  providers: [
    AutomatedPortfolioService,
    AutomatedPortfolioAdminService,
    AutomatedPortfolioRepository,
  ],
})
export class AutomatedPortfolioModule {}
