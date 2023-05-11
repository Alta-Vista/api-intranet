import { Test, TestingModule } from '@nestjs/testing';
import { CompassService } from './compass.service';

describe('CompassService', () => {
  let service: CompassService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompassService],
    }).compile();

    service = module.get<CompassService>(CompassService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
