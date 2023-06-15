import { SESClient, SendTemplatedEmailCommand } from '@aws-sdk/client-ses';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AWSClient } from '../decorators/aws.decorator';
import {} from '../interfaces';
import { SESSenMessageOptions } from '../interfaces/ses-options.interface';

@Injectable()
export class SESService {
  private environment: string;
  private mailSource: string;

  constructor(
    @AWSClient(SESClient) private readonly ses: SESClient,
    private configService: ConfigService,
  ) {
    this.environment = this.configService.get('ENVIRONMENT');
    this.mailSource = this.configService.get('SES_MAIL_SOURCE');
  }

  async sendMessage(options: SESSenMessageOptions) {
    try {
      if (this.environment === 'prod') {
        const command = new SendTemplatedEmailCommand({
          Template: options.template,
          TemplateData: options.templateData,
          Destination: {
            ToAddresses: options.sendTo,
            BccAddresses: options.bccAddress,
            CcAddresses: options.ccAddress,
          },
          Source: this.mailSource,
        });

        const response = await this.ses.send(command);

        console.log(`Message sended with message id ${response.MessageId}`);
      }

      console.log(`Message sended to '${options.sendTo}`);
    } catch (error) {
      console.log(error);
    }
  }
}
