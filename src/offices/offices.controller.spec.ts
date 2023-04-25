import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { Test, TestingModule } from '@nestjs/testing';
import { OfficesController } from './offices.controller';
import { OfficesService } from './offices.service';
import { AdminOfficesController } from './offices-admin.controller';

const moduleMocker = new ModuleMocker(global);

describe('OfficesController', () => {
  let officesController: OfficesController;
  let adminOfficesController: AdminOfficesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OfficesController, AdminOfficesController],
    })
      .useMocker((token) => {
        const results = [{ id: 'id', location: 'location' }];
        const mea = [
          {
            id: 'id',
            operacao: 'Escritorio novo',
            dt_aquisicao: '08/09/2022',
          },
        ];
        const teams = [
          {
            id: '9cb607ab-83dc-461b-9711-3403d3890333',
            nome: 'Equipe Jin',
            id_lider: '93f7bad7-6f97-4685-bd1d-3caa5d1da7d6',
            id_filial: 'c67c262c-3883-473f-a4c3-bbcf6bd16b1d',
            ativa: true,
            dt_criacao: '2023-01-10T00:00:00.000Z',
            dt_encerramento: null,
          },
        ];

        if (token === OfficesService) {
          return {
            findAllOffices: jest.fn().mockResolvedValue(results),
            findAllMeA: jest.fn().mockResolvedValue(mea),
            findAllTeams: jest.fn().mockResolvedValue(teams),
          };
        }

        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    officesController = module.get<OfficesController>(OfficesController);
    adminOfficesController = module.get<AdminOfficesController>(
      AdminOfficesController,
    );
  });

  it('should be able to find all offices', async () => {
    const result = [{ id: 'id', location: 'location' }];

    expect(await officesController.findAll()).toEqual(result);
  });

  it('should be able to find all MeA', async () => {
    const result = [
      {
        id: 'id',
        operacao: 'Escritorio novo',
        dt_aquisicao: '08/09/2022',
      },
    ];

    expect(await adminOfficesController.findAllMeA()).toEqual(result);
  });

  it('should be able to find all teams', async () => {
    const result = [
      {
        id: '9cb607ab-83dc-461b-9711-3403d3890333',
        nome: 'Equipe Jin',
        id_lider: '93f7bad7-6f97-4685-bd1d-3caa5d1da7d6',
        id_filial: 'c67c262c-3883-473f-a4c3-bbcf6bd16b1d',
        ativa: true,
        dt_criacao: '2023-01-10T00:00:00.000Z',
        dt_encerramento: null,
      },
    ];

    expect(await adminOfficesController.findAllTeams()).toEqual(result);
  });
});
