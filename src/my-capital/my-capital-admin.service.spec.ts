import { Test, TestingModule } from '@nestjs/testing';
import { MyCapitalRepository } from './repository/my-capital.repository';
import { HttpException } from '@nestjs/common';
import { Clients } from './entities/my-capital-clients.entity';
import { MyCapitalAdminService } from './my-capital-admin.service';
import { mycapital_status } from '@prisma/client';
import { RequestedClients } from './entities/my-capital-requested-clients.entity';

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

  const requestedClients: RequestedClients[] = [
    {
      id: '123456',
      cod_cliente: 123456,
      id_solicitacao: '1234567',
      pagador: 'ASSESSOR',
      status: 'SOLICITADO',
    },
    {
      id: '1234567',
      cod_cliente: 123456,
      id_solicitacao: '1234567',
      pagador: 'ASSESSOR',
      status: 'ERRO',
    },
    {
      id: '1234568',
      cod_cliente: 123456,
      id_solicitacao: '1234567',
      pagador: 'ASSESSOR',
      status: 'SUCESSO',
    },
  ];

  const mockMyCapitalRepository = {
    listAllRequestedClients: jest.fn().mockImplementation((data) => {
      if (data.status) {
        return requestedClients.filter(
          (client) => client.status === data.status,
        );
      }

      return requestedClients;
    }),
    updateRequestedClient: jest.fn().mockImplementation((data) => {
      const requestedClient = requestedClients.find(
        (request) => request.id === data.id,
      );

      return {
        id: requestedClient.id,
        cod_cliente: requestedClient.cod_cliente,
        id_solicitacao: requestedClient.id_solicitacao,
        pagador: requestedClient.pagador,
        status: data.status,
      };
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
    const listRequestedClients = await service.listRequestedClients({
      limit: 10,
      offset: 1,
    });

    expect(listRequestedClients).toEqual(requestedClients);
  });

  it('should be able to filter requested clients', async () => {
    const filteredClients = [
      {
        id: '1234568',
        cod_cliente: 123456,
        id_solicitacao: '1234567',
        pagador: 'ASSESSOR',
        status: 'SUCESSO',
      },
    ];

    const listRequestedClients = await service.listRequestedClients({
      status: 'SUCESSO',
      limit: 10,
      offset: 1,
    });

    expect(listRequestedClients).toEqual(filteredClients);
  });

  it('should be able to update a client to success', async () => {
    const client = await service.updateRequestedClient({
      status: mycapital_status.SUCESSO,
      request_id: '123456',
    });

    expect(client.status).toBe('SUCESSO');
  });

  it('should be able to update a client to error', async () => {
    const client = await service.updateRequestedClient({
      status: mycapital_status.ERRO,
      request_id: '123456',
      error_message: 'Cliente não foi aprovado por algum motivo',
    });

    expect(client.status).toBe('ERRO');
  });

  it('should not be able to update if there is an error and messege is empty', async () => {
    await expect(
      service.updateRequestedClient({
        status: mycapital_status.ERRO,
        request_id: '123456',
      }),
    ).rejects.toBeInstanceOf(HttpException);
  });
});
