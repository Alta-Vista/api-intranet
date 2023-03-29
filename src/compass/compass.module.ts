import { Module } from '@nestjs/common';
import { CompassService } from './compass.service';
import { CompassController } from './compass.controller';
import { PrismaModule } from '../database/prisma.module';
import { CompassRepository } from './compass.repository';
import { SQSModule } from '../aws/sqs/sqs.module';

@Module({
  imports: [
    PrismaModule,
    SQSModule.register({
      region: 'us-east-1',
    }),
  ],
  controllers: [CompassController],
  providers: [CompassService, CompassRepository],
})
export class CompassModule {}
