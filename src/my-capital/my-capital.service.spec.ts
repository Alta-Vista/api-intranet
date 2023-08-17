import { HttpException } from '@nestjs/common';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { TestingModule, Test } from '@nestjs/testing';
import { myCapitalListenersConstants } from './constants';
import { MyCapitalClients } from './entities/my-capital-clients.entity';
import { MyCapitalService } from './my-capital.service';
import { MyCapitalRepository } from './repository/my-capital.repository';

describe('MyCapitalService', () => {
  let service: MyCapitalService;

  let eventEmitter: EventEmitter2;

  const clients: MyCapitalClients[] = [
    {
      id: Date.now().toString(),
      codigo: 1234567,
      pagador: 'ASSESSOR',
      cod_assessor: 'A12345',
      cpf_cnpj: '000000000',
      email: 'email@email.com',
      nome: 'Kevin Durant',
    },
  ];

  const mockMyCapitalRepository = {
    createRequest: jest
      .fn()
      .mockImplementation((data) =>
        Promise.resolve({ id: Date.now(), requesterId: data }),
      ),
    createClientSolicitation: jest.fn().mockImplementation((data) =>
      Promise.resolve({
        id: Date.now(),
        client: data.client,
        payer: data.payer,
        requestId: data.request_id,
      }),
    ),
    findAdvisorClients: jest.fn().mockImplementation((data) => {
      return clients.filter((client) => client.cod_assessor === data.advisor);
    }),
    findMyCapitalClient: jest.fn().mockImplementation((data) => {
      return clients.find((client) => client.codigo === data);
    }),
  };

  beforeEach(async () => {
    eventEmitter = new EventEmitter2();

    const module: TestingModule = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot()],
      providers: [
        MyCapitalService,
        { provide: MyCapitalRepository, useValue: mockMyCapitalRepository },
        { provide: EventEmitter2, useValue: eventEmitter },
      ],
    }).compile();

    service = module.get<MyCapitalService>(MyCapitalService);
  });

  it('should be able to create a new client request', async () => {
    const requesteClient = await service.create(
      {
        client: 123456,
        payer: 'ASSESSOR',
      },
      '12345',
    );

    expect(requesteClient).toBeTruthy();
  });

  it('should not be able to create a new client if he already exists', async () => {
    await expect(
      service.create({ client: 1234567, payer: 'ASSESSOR' }, '12345'),
    ).rejects.toBeInstanceOf(HttpException);
  });

  it('should be able to list advisors clients', async () => {
    const advisorClients = await service.findAdvisorClients(
      {
        limit: '10',
        offset: '1',
      },
      'A12345',
    );

    expect(advisorClients).toEqual(clients);
  });

  it('should be able to trigger the event new client requested', async () => {
    const spy = jest.spyOn(eventEmitter, 'emit');

    const newClient = await service.create(
      {
        client: 123456,
        payer: 'ASSESSOR',
      },
      '12345',
    );

    expect(spy).toHaveBeenCalledWith(
      myCapitalListenersConstants.NEW_CLIENT_REQUESTED,
      { id: newClient.id },
    );
  });
});
