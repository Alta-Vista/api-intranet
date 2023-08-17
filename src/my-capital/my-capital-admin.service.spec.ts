import { Test, TestingModule } from '@nestjs/testing';
import { MyCapitalRepository } from './repository/my-capital.repository';
import { HttpException } from '@nestjs/common';
import { MyCapitalAdminService } from './my-capital-admin.service';
import { my_capital_status } from '@prisma/client';
import { RequestedClients } from './entities/my-capital-requested-clients.entity';
import { MyCapitalClients } from './entities/my-capital-clients.entity';

describe('MyCapitalService', () => {
  let service: MyCapitalAdminService;

  const myCapitalClients: MyCapitalClients[] = [
    {
      id: '123456',
      cod_assessor: 'A123456',
      codigo: 123456,
      cpf_cnpj: '00000000000',
      email: 'kevin@email.com',
      nome: 'Kevin Durant',
      pagador: 'ASSESSOR',
      solicitacao: {
        status: 'SOLICITADO',
        cod_cliente: 123456,
        id_solicitacao: '1234567',
        id_solicitante: '123456789',
        pagador: 'ASSESSOR',
      },
    },
    {
      id: '123456',
      cod_assessor: 'A123456',
      codigo: 123456,
      cpf_cnpj: '00000000000',
      email: 'kevin@email.com',
      nome: 'Kevin Durant',
      pagador: 'ASSESSOR',
      solicitacao: {
        status: 'SUCESSO',
        cod_cliente: 123456,
        id_solicitacao: '1234567',
        id_solicitante: '123456789',
        pagador: 'ASSESSOR',
      },
    },
  ];

  const requestedClients: RequestedClients[] = [
    {
      id: '123456',
      cod_cliente: 123456,
      id_solicitacao: '1234567',
      pagador: 'ASSESSOR',
      status: 'SOLICITADO',
      id_solicitante: '123456',
    },
    {
      id: '1234567',
      cod_cliente: 123456,
      id_solicitacao: '1234567',
      pagador: 'ASSESSOR',
      status: 'ERRO',
      id_solicitante: '123456',
    },
    {
      id: '1234568',
      cod_cliente: 123456,
      id_solicitacao: '1234567',
      pagador: 'ASSESSOR',
      status: 'SUCESSO',
      id_solicitante: '123456',
    },
  ];

  const mockMyCapitalRepository = {
    listAllMyCapitalClients: jest.fn().mockImplementation((data) => {
      if (data.status) {
        return myCapitalClients.filter(
          (client) => client.solicitacao.status === data.status,
        );
      }

      return myCapitalClients;
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
    const listRequestedClients = await service.listAllMyCapitalClients({
      limit: '10',
      offset: '1',
    });

    expect(listRequestedClients).toEqual(myCapitalClients);
  });

  it('should be able to filter requested clients', async () => {
    const filteredClients = [
      {
        id: '123456',
        cod_assessor: 'A123456',
        codigo: 123456,
        cpf_cnpj: '00000000000',
        email: 'kevin@email.com',
        nome: 'Kevin Durant',
        pagador: 'ASSESSOR',
        solicitacao: {
          status: 'SUCESSO',
          cod_cliente: 123456,
          id_solicitacao: '1234567',
          id_solicitante: '123456789',
          pagador: 'ASSESSOR',
        },
      },
    ];

    const listRequestedClients = await service.listAllMyCapitalClients({
      status: 'SUCESSO',
      limit: '10',
      offset: '1',
    });

    expect(listRequestedClients).toEqual(filteredClients);
  });

  it('should be able to update a client to success', async () => {
    const client = await service.updateRequestedClient({
      status: my_capital_status.SUCESSO,
      request_id: '123456',
    });

    expect(client.status).toBe('SUCESSO');
  });

  it('should be able to update a client to error', async () => {
    const client = await service.updateRequestedClient({
      status: my_capital_status.ERRO,
      request_id: '123456',
      message: 'Cliente não foi aprovado por algum motivo',
    });

    expect(client.status).toBe('ERRO');
  });

  it('should not be able to update if there is an error and messege is empty', async () => {
    await expect(
      service.updateRequestedClient({
        status: my_capital_status.ERRO,
        request_id: '123456',
      }),
    ).rejects.toBeInstanceOf(HttpException);
  });
});
