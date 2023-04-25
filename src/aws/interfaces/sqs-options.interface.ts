export interface SQSSendMessageOptions {
  message: any;
  sqsQueueUrl?: string;
  deduplicationId: string;
  groupId: 'compass' | 'eventos';
}
