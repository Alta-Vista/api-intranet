import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/database/prisma.module';
import { CollaboratorsRepository } from './collaborators.repository';
import { CollaboratorsService } from './collaborators.service';
import { CollaboratorCreatedListener } from './listeners/collaborator-created.listener';
import { ConfigModule } from '@nestjs/config';
import { CollaboratorsAdminController } from './collaborators-admin.controller';

@Module({
  imports: [PrismaModule, ConfigModule.forRoot()],
  providers: [
    CollaboratorsService,
    CollaboratorsRepository,
    CollaboratorCreatedListener,
  ],
  controllers: [CollaboratorsAdminController],
})
export class CollaboratorsModule {}
