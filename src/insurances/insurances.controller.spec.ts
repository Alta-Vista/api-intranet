import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { Test, TestingModule } from '@nestjs/testing';
import { InsurancesAdminController } from './insurances-admin.controller';
import { InsurancesAdminService } from './insurances-admin.service';

const moduleMocker = new ModuleMocker(global);

enum ClientType {
  XP = 'XP',
  EXTERNO = 'EXTERNO',
}

describe('InsurancesAdminController', () => {
  let controller: InsurancesAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InsurancesAdminController],
    })
      .useMocker((token) => {
        if (token === InsurancesAdminService) {
          return {
            createClient: jest.fn((data) => {
              return {
                data,
              };
            }),
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

    controller = module.get<InsurancesAdminController>(
      InsurancesAdminController,
    );
  });

  it('should be able to create a new collaborator', async () => {
    const data = {
      client_type: ClientType.EXTERNO,
      cpf: '123456',
      advisor_code: 'A123456',
      name: 'John',
    };
    expect(controller.createClient(data)).toHaveProperty('data');
  });
});
