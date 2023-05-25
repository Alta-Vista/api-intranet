import { Test, TestingModule } from '@nestjs/testing';
import { AutomatedPortfolioService } from './automated-portfolio.service';

describe('AutomatedPortfolioService', () => {
  let service: AutomatedPortfolioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AutomatedPortfolioService],
    }).compile();

    service = module.get<AutomatedPortfolioService>(AutomatedPortfolioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
