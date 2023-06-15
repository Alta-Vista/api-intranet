export interface SESSenMessageOptions {
  template: 'CompassNewClients';
  templateData: string;
  sendTo: string[];
  bccAddress?: string[];
  ccAddress?: string[];
}
