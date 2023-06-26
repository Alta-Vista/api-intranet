import { SESClient, SESClientConfig } from '@aws-sdk/client-ses';
import { Module } from '@nestjs/common';
import { SES_TOKEN } from '../constants';
import { SESService } from './ses.service';

export type SESModuleOptions = SESClientConfig;

@Module({})
export class SESModule {
  static register(options: SESModuleOptions) {
    return {
      module: SESModule,
      providers: [
        {
          provide: SES_TOKEN,
          useValue: new SESClient(options),
        },
        SESService,
      ],
      exports: [SESModule, SESService],
    };
  }
}
