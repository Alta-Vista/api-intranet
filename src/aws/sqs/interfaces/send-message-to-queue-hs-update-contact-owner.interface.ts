type Contact = {
  code: number;
};

export interface SendMessageToQueueHSUpdateContactOwnerInterface {
  ownerId: string;
  contacts: Contact[];
  deduplicationId: string;
}
