import { Controller, Post, Body } from '@nestjs/common';
import { EventsService } from './events.service';
import { InviteClientToEventDto } from './dto/create-event.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post('invite/clients')
  inviteClient(@Body() inviteClientToEventDto: InviteClientToEventDto) {
    return this.eventsService.inviteClient(inviteClientToEventDto);
  }
}
