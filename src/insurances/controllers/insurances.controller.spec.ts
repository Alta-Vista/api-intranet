import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { Test, TestingModule } from '@nestjs/testing';
import { InsurancesAdminController } from './insurances-admin.controller';
import { InsurancesAdminService } from '../services/insurances-admin.service';
import { InsurancePlansFrequency } from '../interfaces';

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
            createInsurer: jest.fn(() => {
              return { insurer: 'Mongeral' };
            }),
            createInsurerProduct: jest.fn(() => {
              return {
                insurer_id: '123456',
                commission: 10,
                product: 'Seguro de vida',
              };
            }),
            createPlansStep: jest.fn(() => {
              return { step: 'Fechando negócio' };
            }),
            createInsurancePlan: jest.fn((data) => {
              return { data };
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

  it('should be able to create a new external client', async () => {
    const data = {
      client_type: ClientType.EXTERNO,
      cpf: '123456',
      advisor_code: 'A123456',
      name: 'John',
    };
    expect(controller.createClient(data)).toHaveProperty('data');
  });

  it('should be able to create a new xp client', async () => {
    const data = {
      client_type: ClientType.XP,
      client: '123456',
      advisor_code: 'A123456',
      name: 'John',
    };
    expect(controller.createClient(data)).toHaveProperty('data');
  });

  it('should be able to create a new insurer', async () => {
    expect(controller.createInsurer({ insurer: 'Mongeral' })).toEqual({
      insurer: 'Mongeral',
    });
  });

  it('should be able to create a new insurer product', async () => {
    expect(
      controller.createInsurerProduct({
        insurer_id: '123456',
        commission: 10,
        product: 'Seguro de vida',
      }),
    ).toEqual({
      insurer_id: '123456',
      commission: 10,
      product: 'Seguro de vida',
    });
  });

  it('should be able to create a new insurer product', async () => {
    expect(
      controller.createPlansStep({
        step: 'Fechando negócio',
      }),
    ).toEqual({
      step: 'Fechando negócio',
    });
  });

  it('should be able to create a new insurer product', async () => {
    const data = {
      advisor: 'A123',
      client_id: '123',
      commission_percentage: 10,
      consultant_id: '123',
      frequency: InsurancePlansFrequency.ANUAL,
      from_allocation: false,
      implemented_at: new Date(),
      insurer_id: '123456',
      pa: 1000,
      paid_at: new Date(),
      pi: 1000,
      product_id: '123456',
      recommended_at: new Date(),
      step_id: '123456',
      total_commission: 10000,
      updated_at: new Date(),
    };

    expect(controller.createInsurancePlan(data)).toHaveProperty('data');
  });
});
