import { HttpException, Injectable } from '@nestjs/common';
import { InviteClientToEventDto } from './dto/create-event.dto';
import { EventsRepository } from './events.repository';
import { CollaboratorsRepository } from '../collaborators/collaborators.repository';

@Injectable()
export class EventsService {
  constructor(
    private readonly eventsRepository: EventsRepository,
    private readonly collaboratorsRepository: CollaboratorsRepository,
  ) {}

  async inviteClient({ event_id, client, advisor }: InviteClientToEventDto) {
    const event = await this.eventsRepository.getEventById(event_id);

    const limitDate = new Date(event.dt_evento).toLocaleDateString('pt-br', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    const currentDate = new Date().toLocaleDateString('pt-br', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    if (currentDate > limitDate) {
      throw new HttpException('Event has already been closed', 403);
    }

    const findClient = await this.eventsRepository.findClientByCode(client);

    if (!findClient) {
      return console.log('Client not found');
    }

    const status = await this.eventsRepository.getEventInvitedStatus(
      'Pendente',
    );

    const invitedType = await this.eventsRepository.getEventInvitedType(
      'Cliente',
    );

    const collaborator =
      await this.collaboratorsRepository.findCollaboratorByAdvisorCode(advisor);

    const clientAlreadyInvited = await this.eventsRepository.findClientInEvent(
      findClient.id,
      event_id,
    );

    if (clientAlreadyInvited) {
      throw new HttpException('even.invited', 409);
    }

    const inviteClientToEvent = await this.eventsRepository.inviteClient({
      event_id,
      client_id: findClient.id,
      guest_id: collaborator.id,
      status_id: status.id,
      invited_type_id: invitedType.id,
    });

    return inviteClientToEvent;
  }
}
