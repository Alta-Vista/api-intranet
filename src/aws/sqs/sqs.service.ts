import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AWSClient } from '../decorators/aws.decorator';
import { SQSSendMessageOptions } from '../interfaces';
import {
  SendMessageToQueueHSUpdateContactOwnerInterface,
  SendMessageToQueueHubSpotCreateOwnerTaskInterface,
} from './interfaces';

@Injectable()
export class SQSService {
  private queueURL: string;
  private environment: string;
  private hsUpdateContactOwnerQueue: string;
  private hsCreateOwnerTaskQueue: string;
  private readonly logger = new Logger(SQSService.name);

  constructor(
    @AWSClient(SQSClient) private readonly sqs: SQSClient,
    private configService: ConfigService,
  ) {
    this.queueURL = this.configService.get('SQS_QUEUE_URL');
    this.environment = this.configService.get('ENVIRONMENT');
    this.hsUpdateContactOwnerQueue = this.configService.get(
      'SQS_QUEUE_HS_UPDATE_CONTACT_OWNER',
    );
    this.hsCreateOwnerTaskQueue = this.configService.get(
      'SQS_QUEUE_HS_CREATE_OWNER_TASK',
    );
  }

  async sendMessage(options: SQSSendMessageOptions) {
    try {
      if (this.environment === 'prod') {
        const command = new SendMessageCommand({
          QueueUrl: options.sqsQueueUrl ? options.sqsQueueUrl : this.queueURL,
          MessageBody: options.message,
          MessageDeduplicationId: options.deduplicationId,
          MessageGroupId: options.groupId,
        });

        const response = await this.sqs.send(command);

        this.logger.log(`Message sended with message id ${response.MessageId}`);
      }

      this.logger.log(
        `Message send with id '${options.deduplicationId}' and group '${options.groupId}'`,
      );
    } catch (error) {
      this.logger.error(error);
    }
  }

  async sendMessageToQueueHSUpdateContactOwner(
    options: SendMessageToQueueHSUpdateContactOwnerInterface,
  ) {
    const message = {
      ownerId: options.ownerId,
      contacts: options.contacts,
    };

    try {
      if (this.environment === 'dev') {
        this.logger.log(
          `Message send with body '${JSON.stringify(
            message,
            null,
            3,
          )}' and group 'hubspot-update-contact-owner'`,
        );

        return;
      }

      const command = new SendMessageCommand({
        QueueUrl: this.hsUpdateContactOwnerQueue,
        MessageBody: JSON.stringify(message),
        MessageDeduplicationId: options.deduplicationId,
        MessageGroupId: 'hubspot-update-contact-owner',
      });

      const response = await this.sqs.send(command);

      this.logger.log(`Message send with message id ${response.MessageId}`);
    } catch (error) {
      this.logger.error(error);
      console.log(error);
    }
  }

  async sendMessageToQueueHubSpotCreateOwnerTask(
    options: SendMessageToQueueHubSpotCreateOwnerTaskInterface,
  ) {
    const message = {
      ownerId: options.ownerId,
      tasks: options.tasks,
      expiresAt: options.expiresAt,
    };

    try {
      if (this.environment === 'dev') {
        this.logger.log(
          `Message send with id '${options.deduplicationId}' and group 'hubspot-create-owner-task'`,
        );
      }

      const command = new SendMessageCommand({
        QueueUrl: this.hsCreateOwnerTaskQueue,
        MessageBody: JSON.stringify(message),
        MessageDeduplicationId: options.deduplicationId,
        MessageGroupId: 'hubspot-create-owner-task',
      });

      const response = await this.sqs.send(command);

      this.logger.log(`Message send with message id ${response.MessageId}`);
    } catch (error) {
      this.logger.error(error);
      console.log(error);
    }
  }
}
