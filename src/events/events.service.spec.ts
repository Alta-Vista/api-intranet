import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { EventsRepository } from './events.repository';
import { CollaboratorsRepository } from '../collaborators/collaborators.repository';
import { randomUUID } from 'node:crypto';
import { HttpException } from '@nestjs/common';

describe('EventsService', () => {
  let service: EventsService;

  const clients = [
    { id: '123456', codigo: 123456 },
    { id: '1234567', codigo: 1234567 },
  ];
  const events = [
    { id: '123456', dt_evento: '2023-07-20' },
    { id: '1234567', dt_evento: '2023-07-10' },
  ];
  const advisors = [{ id: randomUUID(), cod_assessor: 'A123456' }];
  const eventStatus = [{ id: randomUUID(), status: 'Pendente' }];
  const eventGuests = [{ event_id: '123456', client: '1234567' }];
  const guestType = [{ id: '123456', type: 'Cliente' }];

  const mockEventsRepository = {
    inviteClient: jest.fn(() => {
      const inviteClient = {
        id: randomUUID(),
        id_convidador: randomUUID(),
        id_cliente: randomUUID(),
        id_tp_convidado: randomUUID(),
        id_status: randomUUID(),
        compareceu: false,
      };

      return inviteClient;
    }),
    findClientByCode: jest.fn((code: number) => {
      const client = clients.find((client) => client.codigo === code);

      return client;
    }),
    findClientInEvent: jest.fn((guest_id: string, event_id: string) => {
      const clientInvited = eventGuests.find(
        (guests) => guests.client === guest_id && guests.event_id === event_id,
      );

      return clientInvited;
    }),
    getEventInvitedStatus: jest.fn((value: string) => {
      const findStatus = eventStatus.find((status) => status.status === value);

      return findStatus;
    }),
    getEventById: jest.fn((id: string) => {
      return events.find((event) => event.id === id);
    }),
    getEventInvitedType: jest.fn((clientType: string) => {
      return guestType.find((type) => type.type === clientType);
    }),
  };

  const mockCollaboratorsRepository = {
    findCollaboratorByAdvisorCode: jest.fn((code: string) => {
      const advisor = advisors.find((advisor) => advisor.cod_assessor === code);

      return advisor;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventsRepository, EventsService, CollaboratorsRepository],
    })
      .overrideProvider(EventsRepository)
      .useValue(mockEventsRepository)
      .overrideProvider(CollaboratorsRepository)
      .useValue(mockCollaboratorsRepository)
      .compile();

    service = module.get<EventsService>(EventsService);
  });

  it('should be able to invite client', async () => {
    const inviteClient = await service.inviteClient({
      client: 123456,
      event_id: '123456',
      advisor: 'A123456',
    });

    expect(inviteClient).toHaveProperty('id');
  });

  it('should not be able to invite client twice', async () => {
    await expect(
      service.inviteClient({
        client: 1234567,
        event_id: '123456',
        advisor: 'A123456',
      }),
    ).rejects.toBeInstanceOf(HttpException);
  });

  it('should not be able to invite client if event already ended', async () => {
    await expect(
      service.inviteClient({
        client: 1234567,
        event_id: '1234567',
        advisor: 'A123456',
      }),
    ).rejects.toBeInstanceOf(HttpException);
  });
});
