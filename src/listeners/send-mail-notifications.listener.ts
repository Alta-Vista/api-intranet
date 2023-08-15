import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SESService } from 'src/aws/ses/ses.service';
import { senMailConstant } from './constants';

interface SendNotificationListenerInterface {
  to: string;
  name: string;
  message: string;
  subject: string;
}

@Injectable()
export class SendMailNotificationsListener {
  constructor(private readonly sesService: SESService) {}

  @OnEvent(senMailConstant.SEND_NOTIFICATION_MAIL)
  async sendNotification(payload: SendNotificationListenerInterface) {
    const templateData = {
      name: payload.name,
      text: payload.message,
      subject: payload.subject,
    };

    await this.sesService.sendMessage({
      template: 'NotificationTemplate',
      sendTo: [payload.to],
      templateData: JSON.stringify(templateData),
    });
  }
}
