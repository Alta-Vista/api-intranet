import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AWSClient } from '../decorators/aws.decorator';
import { SQSSendMessageOptions } from '../interfaces';

@Injectable()
export class SQSService {
  private queueURL: string;
  private environment: string;

  constructor(
    @AWSClient(SQSClient) private readonly sqs: SQSClient,
    private configService: ConfigService,
  ) {
    this.queueURL = this.configService.get('SQS_QUEUE_URL');
    this.environment = this.configService.get('ENVIRONMENT');
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

        await this.sqs.send(command);
      }

      console.log(
        `Message send with id '${options.deduplicationId}' and group '${options.groupId}'`,
      );
    } catch (error) {
      console.log(error);
    }
  }
}
