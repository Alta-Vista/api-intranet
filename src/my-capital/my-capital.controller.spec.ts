import { Test, TestingModule } from '@nestjs/testing';
import { MyCapitalController } from './my-capital.controller';
import { MyCapitalService } from './my-capital.service';
import { CollaboratorAuthInterface } from '../auth-provider/interfaces/collaborators-auth.interface';
import { AuthorizationGuard } from '../authorization/authorization.guard';
import { MyCapitalClients } from './entities/my-capital-clients.entity';
import { RequestedClients } from './entities/my-capital-requested-clients.entity';

describe('MyCapitalController', () => {
  let controller: MyCapitalController;

  const user: CollaboratorAuthInterface = {
    'http://user/metadata': {
      Assessor: 'A123456',
    },
    sub: 'auth0|123456',
  };

  const clients: MyCapitalClients[] = [
    {
      cod_assessor: 'A123456',
      codigo: 123456,
      cpf_cnpj: '00000000',
      email: 'email@email.com',
      nome: 'Kevin durant',
      pagador: 'SUBSIDIO',
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

  const mockMyCapitalService = {
    create: jest.fn().mockImplementation((data) => {
      return {
        id: Date.now(),
        ...data,
      };
    }),
    listRequestedClients: jest.fn().mockImplementation((data, requester_id) => {
      return requestedClients.filter(
        (client) => client.id_solicitante === requester_id,
      );
    }),
    findAdvisorClients: jest.fn().mockImplementation((data, advisor) => {
      return clients.filter((client) => client.cod_assessor === advisor);
    }),
  };

  const mockAuthGuard = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MyCapitalController],
      providers: [
        { provide: MyCapitalService, useValue: mockMyCapitalService },
      ],
    })
      .overrideGuard(AuthorizationGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<MyCapitalController>(MyCapitalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be able to send new client', async () => {
    const client = await controller.create(
      {
        client: 123456,
        payer: 'ASSESSOR',
      },
      user,
    );

    expect(client).toHaveProperty('id');
  });

  it('should be able to list advisors clients', async () => {
    const advisorClients = await controller.findAll(user, {
      limit: '10',
      offset: '1',
    });

    expect(advisorClients).toEqual(clients);
    expect(advisorClients).toHaveLength(1);
  });

  it('should be able to list requested clients', async () => {
    const userRequestedClients = await controller.findAllRequestedClients(
      { limit: '10', offset: '1' },
      user,
    );

    expect(userRequestedClients).toEqual(requestedClients);
    expect(userRequestedClients).toHaveLength(3);
  });
});
