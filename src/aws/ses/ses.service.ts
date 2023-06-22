import { SESClient, SendTemplatedEmailCommand } from '@aws-sdk/client-ses';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AWSClient } from '../decorators/aws.decorator';
import {} from '../interfaces';
import { SESSenMessageOptions } from '../interfaces/ses-options.interface';
import { SESSenMessageCompassTemplateOptions } from './interfaces';

@Injectable()
export class SESService {
  private environment: string;
  private mailSource: string;

  private readonly logger = new Logger(SESService.name);

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

        this.logger.log(`Message sended with message id ${response.MessageId}`);
      }

      this.logger.log(`Message sended to '${options.sendTo}`);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async sendMessageCompassTemplate(
    options: SESSenMessageCompassTemplateOptions,
  ) {
    try {
      const text =
        'Você recebeu novos clientes na sua base, eles foram atribuídos pela Intranet e até amanhã as 09h irão aparecer no HUB. Mas você pode encontra-los no CRM e verificar as tarefas que foram atribuídos para aquele cliente.';

      const ccAddresses = [
        'rafael.fredini@altavistainvest.com.br',
        'bruno.maciel@altavistainvest.com.br',
      ];

      if (this.environment === 'dev') {
        this.logger.log(`Message sended to '${options.sendTo}`);
      }

      const command = new SendTemplatedEmailCommand({
        Template: 'CompassNewClients',
        TemplateData: JSON.stringify({
          name: options.name,
          text,
          subject: '[SEGMENTO COMPASS] - Novos clientes',
        }),
        Destination: {
          ToAddresses: [options.sendTo],
          CcAddresses: ccAddresses,
        },
        Source: this.mailSource,
      });

      const response = await this.ses.send(command);

      this.logger.log(`E-mail sended with message id ${response.MessageId}`);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
