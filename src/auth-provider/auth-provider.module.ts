import { Module } from '@nestjs/common';
import { CollaboratorCreatedListener } from './listeners/collaborator-created.listener';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [CollaboratorCreatedListener],
})
export class AuthProviderModule {}
