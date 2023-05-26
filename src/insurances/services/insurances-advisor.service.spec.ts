import { Test, TestingModule } from '@nestjs/testing';
import { InsurancesAdvisorService } from './insurances-advisor.service';
import { InsuranceRepository } from '../insurances.repository';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { InsurancePlansFrequency } from '../interfaces';

const moduleMocker = new ModuleMocker(global);

const advisorClients = [
  { id: '123', cpf: '123456', xp_code: 123, name: 'John', advisor: 'A123456' },
  {
    id: '1234',
    cpf: '1234567',
    xp_code: 1235,
    name: 'John Doe',
    advisor: 'A123456',
  },
];

const insurancePlan = [
  {
    id: '123',
    client_id: '112',
    consultant_id: '102030',
    advisor: 'A123456',
    insurer_id: '102030',
    pi: 1000.1,
    frequency: InsurancePlansFrequency.ANUAL,
    product_id: '123',
    pa: 10000.2,
    from_allocation: true,
    commission_percentage: 10,
    total_commission: 100000.1,
    step_id: '123456',
    recommended_at: new Date(),
    updated_at: new Date(),
    implemented_at: new Date(),
    paid_at: new Date(),
  },
];

describe('InsurancesAdvisorService', () => {
  let service: InsurancesAdvisorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InsurancesAdvisorService],
    })
      .useMocker((token) => {
        if (token === InsuranceRepository) {
          return {
            listAdvisorClients: jest.fn().mockResolvedValue(advisorClients),
            listClientsPlans: jest.fn().mockResolvedValue(insurancePlan),
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

    service = module.get<InsurancesAdvisorService>(InsurancesAdvisorService);
  });

  it('should be able to list advisor insurances clients', async () => {
    const clients = await service.listAdvisorClients({
      offset: '1',
      limit: '10',
    });

    expect(clients).toEqual(advisorClients);
  });
});
