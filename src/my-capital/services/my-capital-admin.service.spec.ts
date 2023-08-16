import { Test, TestingModule } from '@nestjs/testing';
import { MyCapitalService } from './my-capital.service';
import { MyCapitalRepository } from '../repository/my-capital.repository';
//import { HttpException } from '@nestjs/common';
import { Clients } from '../entities/my-capital-clients.entity';
import { MyCapitalAdminService } from './my-capital-admin.service';

describe('MyCapitalService', () => {
  let service: MyCapitalAdminService;

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
        MyCapitalAdminService,
        { provide: MyCapitalRepository, useValue: mockMyCapitalRepository },
      ],
    }).compile();

    service = module.get<MyCapitalAdminService>(MyCapitalAdminService);
  });

  it('should be able to list all requested clients', async () => {
    const requestedClients = await service.listRequestedClients();

    expect(requestedClients).toEqual(clients);
  });
});
