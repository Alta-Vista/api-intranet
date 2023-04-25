import { Test, TestingModule } from '@nestjs/testing';
import { CompassController } from './compass.controller';
import { CompassService } from './compass.service';

describe('CompassController', () => {
  let controller: CompassController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompassController],
      providers: [CompassService],
    }).compile();

    controller = module.get<CompassController>(CompassController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
