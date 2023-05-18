import { Test, TestingModule } from '@nestjs/testing';
import { InsurancesAdminService } from './insurances-admin.service';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { InsuranceRepository } from '../insurances.repository';
import { ClientType, InsurancePlansFrequency } from '../interfaces';
import { HttpException } from '@nestjs/common';

const moduleMocker = new ModuleMocker(global);

const insuranceClients = [
  { id: '123', cpf: '123456', xp_code: 123, name: 'John', advisor: 'A123456' },
  {
    id: '1234',
    cpf: '1234567',
    xp_code: 1235,
    name: 'John Doe',
    advisor: 'A123456',
  },
];

const insuranceInsurers = [{ id: '123', insurer: 'Icatu' }];
const insurerProduct = {
  product: 'Proteção patrimonial',
  insurer_id: '123',
  commission: 20.2,
};
const insurancePlan = {
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
};
const plansStep = 'Pago';

const insurerProducts = [insurerProduct];

describe('InsurancesService', () => {
  let service: InsurancesAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InsurancesAdminService],
    })
      .useMocker((token) => {
        if (token === InsuranceRepository) {
          return {
            createInsuranceClient: jest.fn().mockResolvedValue({ id: '1234' }),
            createInsurer: jest
              .fn()
              .mockResolvedValue({ id: '123', insurer: 'Icatu' }),
            createInsurerProduct: jest.fn().mockResolvedValue({
              product: 'Seguro de vida',
              insurer_id: '123',
            }),
            createPlansStep: jest
              .fn()
              .mockReturnValue({ step: 'Assinatura pendente' }),
            createInsurancePlan: jest.fn().mockReturnValue(insurancePlan),
            findClient: jest.fn().mockImplementation((data) => {
              let foundInsuranceClient: unknown;

              if (data.cpf)
                foundInsuranceClient = insuranceClients.find(
                  (client) => client.cpf === data.cpf,
                );

              if (data.xp_code)
                foundInsuranceClient = insuranceClients.find(
                  (client) => client.xp_code === data.xp_code,
                );

              return foundInsuranceClient;
            }),
            findInsurer: jest.fn().mockImplementation((data) => {
              const findInsuranceInsurer = insuranceInsurers.find(
                (client) => client.insurer === data,
              );

              return findInsuranceInsurer;
            }),
            findInsurerProduct: jest
              .fn()
              .mockImplementation((product, insurer_id) => {
                const products = insurerProducts.filter(
                  (p) => p.product === product && p.insurer_id === insurer_id,
                );

                return products[0];
              }),
            findPlansStep: jest.fn().mockImplementation((step) => {
              const steps = [plansStep];

              const findStep = steps.find((s) => step === s);

              return findStep;
            }),
            listAllClients: jest.fn().mockResolvedValue(insuranceClients),
            totalInsuranceClients: jest.fn().mockResolvedValue(6),
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

    service = module.get<InsurancesAdminService>(InsurancesAdminService);
  });

  it('should be able to create a new external client', async () => {
    const client = await service.createClient({
      name: 'John',
      cpf: '12345',
      advisor_code: 'A12356',
      client_type: ClientType.EXTERNO,
    });

    expect(client).toHaveProperty('id');
  });

  it('should be able to create a new xp client', async () => {
    const client = await service.createClient({
      name: 'John',
      xp_code: 12345,
      advisor_code: 'A12356',
      client_type: ClientType.XP,
    });

    expect(client).toHaveProperty('id');
  });

  it('should not be able to create a xp client that already exists', async () => {
    await expect(
      service.createClient({
        name: 'John',
        xp_code: 123,
        advisor_code: 'A12356',
        client_type: ClientType.XP,
      }),
    ).rejects.toBeInstanceOf(HttpException);
  });

  it('should be able to list insurance clients', async () => {
    const clients = await service.listClients({ limit: '10', offset: '1' });

    expect(clients).toEqual(insuranceClients);
  });

  it('should be able to create a new insurer', async () => {
    const insurer = await service.createInsurer({ insurer: 'Mongeral' });

    expect(insurer).toEqual({ id: '123', insurer: 'Icatu' });
  });

  it('should not be able to create a insurer that already exists', async () => {
    await expect(
      service.createInsurer({ insurer: 'Icatu' }),
    ).rejects.toBeInstanceOf(HttpException);
  });

  it('should be able to create a new insurer product', async () => {
    const product = await service.createInsurerProduct({
      product: 'Seguro de vida',
      insurer_id: '123',
      commission: 20.2,
    });

    expect(product).toEqual({
      product: 'Seguro de vida',
      insurer_id: '123',
    });
  });

  it('should not be able to create a insurer product that already exists', async () => {
    await expect(
      service.createInsurerProduct(insurerProduct),
    ).rejects.toBeInstanceOf(HttpException);
  });

  it('should be able to create a new plan step', async () => {
    const step = await service.createPlansStep('Assinatura pendente');

    expect(step).toEqual({ step: 'Assinatura pendente' });
  });

  it('should not be able to create a new plan step that already exists', async () => {
    await expect(service.createPlansStep(plansStep)).rejects.toBeInstanceOf(
      HttpException,
    );
  });

  it('should be able to create a new insurance plan to client', async () => {
    const plan = await service.createInsurancePlan(insurancePlan);

    expect(plan).toEqual(insurancePlan);
  });
});
