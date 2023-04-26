import { Module } from '@nestjs/common';
import { CompassService } from './compass.service';
import { CompassController } from './compass.controller';
import { PrismaModule } from '../database/prisma.module';
import { CompassRepository } from './compass.repository';
import { SQSModule } from '../aws/sqs/sqs.module';
import { CollaboratorsModule } from 'src/collaborators/collaborators.module';
import { CompassAdminController } from './compass-admin.controller';

@Module({
  imports: [
    PrismaModule,
    SQSModule.register({
      region: process.env.AWS_REGION,
      endpoint: process.env.AWS_SQS_ENDPOINT,
    }),
    CollaboratorsModule,
  ],
  controllers: [CompassController, CompassAdminController],
  providers: [CompassService, CompassRepository],
})
export class CompassModule {}
