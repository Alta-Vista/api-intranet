import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { AuthorizationModule } from './authorization/authorization.module';
import { CollaboratorsModule } from './collaborators/collaborators.module';
import { OfficesModule } from './offices/offices.module';
import { AuthProviderModule } from './auth-provider/auth-provider.module';

@Module({
  imports: [
    AuthorizationModule,
    AuthProviderModule,
    ConfigModule.forRoot(),
    CollaboratorsModule,
    EventEmitterModule.forRoot(),
    OfficesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
