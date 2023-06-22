type Task = {
  code: number;
  advisor: string;
  subject: string;
  text: string;
};

export interface SendMessageToQueueHubSpotCreateOwnerTaskInterface {
  ownerId: string;
  tasks: Task[];
  deduplicationId: string;
  expiresAt: Date;
}
