import { SQSClient, SQSClientConfig } from '@aws-sdk/client-sqs';
import { Module } from '@nestjs/common';
import { SQS_TOKEN } from '../constants';
import { SQSService } from './sqs.service';

export type SQSModuleOptions = SQSClientConfig;

@Module({})
export class SQSModule {
  static register(options: SQSModuleOptions) {
    return {
      module: SQSModule,
      providers: [
        {
          provide: SQS_TOKEN,
          useValue: new SQSClient(options),
        },
        SQSService,
      ],
      exports: [SQSModule, SQSService],
    };
  }
}
