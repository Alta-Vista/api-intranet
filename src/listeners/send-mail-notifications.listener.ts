import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SESService } from 'src/aws/ses/ses.service';

interface SendNotificationListenerInterface {
  to: string;
  name: string;
  message: string;
  subject: string;
}

@Injectable()
export class SendMailNotificationsListener {
  constructor(private readonly sesService: SESService) {}

  @OnEvent('notification.send-notification')
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
