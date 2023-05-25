import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { AuthorizationModule } from './authorization/authorization.module';
import { CollaboratorsModule } from './collaborators/collaborators.module';
import { OfficesModule } from './offices/offices.module';
import { AuthProviderModule } from './auth-provider/auth-provider.module';
import { CompassModule } from './compass/compass.module';
import { InsurancesModule } from './insurances/insurances.module';
import { AutomatedPortfolioModule } from './automated-portfolio/automated-portfolio.module';

@Module({
  imports: [
    AuthorizationModule,
    AuthProviderModule,
    ConfigModule.forRoot({ isGlobal: true }),
    CollaboratorsModule,
    EventEmitterModule.forRoot({ global: true }),
    OfficesModule,
    CompassModule,
    InsurancesModule,
    AutomatedPortfolioModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
