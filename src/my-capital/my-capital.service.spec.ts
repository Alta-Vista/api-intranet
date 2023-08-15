import { Test, TestingModule } from '@nestjs/testing';
import { MyCapitalService } from './my-capital.service';
import { MyCapitalRepository } from './repository/my-capital.repository';
import { HttpException } from '@nestjs/common';
import { Clients } from './entities/my-capital-clients.entity';

describe('MyCapitalService', () => {
  let service: MyCapitalService;

  const clients: Clients[] = [
    {
      id: Date.now().toString(),
      codigo: 1234567,
      pagador: 'ASSESSOR',
      cod_a: 'A12345',
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
    findAdvisorClients: jest
      .fn()
      .mockImplementation((data) =>
        clients.filter((client) => client.cod_a === data),
      ),
    findMyCapitalClient: jest.fn().mockImplementation((data) => {
      return clients.find((client) => client.codigo === data);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MyCapitalService,
        { provide: MyCapitalRepository, useValue: mockMyCapitalRepository },
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

    expect(requesteClient).toHaveProperty('id');
  });

  it('should not be able to create a new client if he already exists', async () => {
    await expect(
      service.create(
        {
          client: 1234567,
          payer: 'ASSESSOR',
        },
        '12345',
      ),
    ).rejects.toBeInstanceOf(HttpException);
  });

  it('should be able to list advisors clients', async () => {
    const advisorClients = await service.findAdvisorClients('A12345');

    expect(advisorClients).toEqual(clients);
  });
});
