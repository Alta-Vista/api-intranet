import { Test, TestingModule } from '@nestjs/testing';
import { InsurancesAdminService } from './insurances-admin.service';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { InsuranceRepository } from './insurances.repository';
import { ClientType } from './interfaces';
import { HttpException } from '@nestjs/common';

const moduleMocker = new ModuleMocker(global);

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
            findClient: jest.fn().mockImplementation((data) => {
              const clients = [{ id: '123', cpf: '123456', xp_code: 123 }];

              let foundInsuranceClient: unknown;

              if (data.cpf)
                foundInsuranceClient = clients.find(
                  (client) => client.cpf === data.cpf,
                );

              if (data.xp_code)
                foundInsuranceClient = clients.find(
                  (client) => client.xp_code === data.xp_code,
                );

              return foundInsuranceClient;
            }),
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
});
