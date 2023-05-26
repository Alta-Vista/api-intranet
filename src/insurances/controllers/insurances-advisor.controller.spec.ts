import { Test, TestingModule } from '@nestjs/testing';
import { InsurancesAdvisorController } from './insurances-advisor.controller';

describe('InsurancesAdvisorController', () => {
  let controller: InsurancesAdvisorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InsurancesAdvisorController],
    }).compile();

    controller = module.get<InsurancesAdvisorController>(
      InsurancesAdvisorController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
