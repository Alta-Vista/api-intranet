import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { CollaboratorsRepository } from './collaborators.repository';
import { CollaboratorsService } from './collaborators.service';
import { CollaboratorCreatedListener } from './listeners/collaborator-created.listener';
import { ConfigModule } from '@nestjs/config';
import { CollaboratorsAdminController } from './collaborators-admin.controller';

@Module({
  imports: [DatabaseModule, ConfigModule.forRoot()],
  providers: [
    CollaboratorsService,
    CollaboratorsRepository,
    CollaboratorCreatedListener,
  ],
  controllers: [CollaboratorsAdminController],
  exports: [CollaboratorsRepository],
})
export class CollaboratorsModule {}
