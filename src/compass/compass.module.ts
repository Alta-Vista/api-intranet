import { Module } from '@nestjs/common';
import { CompassService, CompassAdvisorService } from './services';
import { DatabaseModule } from '../database/database.module';
import { CompassRepository } from './compass.repository';
import { SQSModule } from '../aws/sqs/sqs.module';
import { CollaboratorsModule } from '../collaborators/collaborators.module';
import {
  CompassAdminController,
  CompassAdvisorController,
  CompassController,
} from './controllers';

@Module({
  imports: [
    DatabaseModule,
    SQSModule.register({
      endpoint: process.env.AWS_SQS_ENDPOINT,
    }),
    CollaboratorsModule,
  ],
  controllers: [
    CompassController,
    CompassAdminController,
    CompassAdvisorController,
  ],
  providers: [CompassService, CompassAdvisorService, CompassRepository],
})
export class CompassModule {}
