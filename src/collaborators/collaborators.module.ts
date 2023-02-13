import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/database/prisma.module';
import { CollaboratorsController } from './collaborators.controller';
import { CollaboratorsRepository } from './collaborators.repository';
import { CollaboratorsService } from './collaborators.service';
import { CollaboratorCreatedListener } from './listeners/collaborator-created.listener';

@Module({
  imports: [PrismaModule],
  providers: [
    CollaboratorsService,
    CollaboratorsRepository,
    CollaboratorCreatedListener,
  ],
  controllers: [CollaboratorsController],
})
export class CollaboratorsModule {}
