import { Test, TestingModule } from '@nestjs/testing';
import { AutomatedPortfolioController } from './automated-portfolio.controller';
import { AutomatedPortfolioService } from './automated-portfolio.service';

describe('AutomatedPortfolioController', () => {
  let controller: AutomatedPortfolioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AutomatedPortfolioController],
      providers: [AutomatedPortfolioService],
    }).compile();

    controller = module.get<AutomatedPortfolioController>(
      AutomatedPortfolioController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
