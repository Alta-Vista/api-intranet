import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SendMailNotificationsListener } from './listeners/send-mail-notifications.listener';

import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthorizationModule } from './authorization/authorization.module';
import { CollaboratorsModule } from './collaborators/collaborators.module';
import { OfficesModule } from './offices/offices.module';
import { AuthProviderModule } from './auth-provider/auth-provider.module';
import { CompassModule } from './compass/compass.module';
import { AutomatedPortfolioModule } from './automated-portfolio/automated-portfolio.module';
import { SESModule } from './aws/ses/ses.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    AuthorizationModule,
    AuthProviderModule,
    ConfigModule.forRoot({ isGlobal: true }),
    CollaboratorsModule,
    EventEmitterModule.forRoot({ global: true }),
    OfficesModule,
    CompassModule,
    AutomatedPortfolioModule,
    SESModule.register({
      region: process.env.SES_MAIL_REGION,
    }),
    EventsModule,
  ],
  providers: [SendMailNotificationsListener],
})
export class AppModule {}
