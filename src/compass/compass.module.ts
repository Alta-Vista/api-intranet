import { Module } from '@nestjs/common';
import {
  CompassService,
  CompassAdvisorService,
  CompassAdminService,
} from './services';
import { DatabaseModule } from '../database/database.module';
import { CompassRepository } from './compass.repository';
import { SQSModule } from '../aws/sqs/sqs.module';
import { CollaboratorsModule } from '../collaborators/collaborators.module';
import {
  CompassAdminController,
  CompassAdvisorController,
  CompassController,
} from './controllers';
import { HubSpotModule } from 'src/hubspot/hubspot.module';
import { ClientsAssignedListener } from './listeners/clients-assigned.listener';
import { CreateOwnerTaskListener } from './listeners/create-owner-task.listener';
import { SESModule } from 'src/aws/ses/ses.module';
import { ClientsReassignedListener } from './listeners';

@Module({
  imports: [
    DatabaseModule,
    SQSModule.register({
      endpoint: process.env.AWS_SQS_ENDPOINT,
    }),
    CollaboratorsModule,
    HubSpotModule,
    SESModule.register({
      region: process.env.AWS_REGION,
    }),
  ],
  controllers: [
    CompassController,
    CompassAdminController,
    CompassAdvisorController,
  ],
  providers: [
    CompassService,
    CompassAdvisorService,
    CompassAdminService,
    CompassRepository,
    ClientsAssignedListener,
    CreateOwnerTaskListener,
    ClientsReassignedListener,
  ],
})
export class CompassModule {}
