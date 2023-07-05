export interface SESSenMessageOptions {
  template: 'CompassNewClients' | 'NotificationTemplate';
  templateData: string;
  sendTo: string[];
  bccAddress?: string[];
  ccAddress?: string[];
}
