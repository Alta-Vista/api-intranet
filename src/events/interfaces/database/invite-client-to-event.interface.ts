export interface InviteClientToEventInterface {
  event_id: string;
  guest_id: string;
  client_id?: string;
  prospect_id?: string;
  invited_type_id: string;
  status_id: string;
}
