import { Test, TestingModule } from '@nestjs/testing';
import { MyCapitalController } from './my-capital.controller';
import { MyCapitalService } from './my-capital.service';

describe('MyCapitalController', () => {
  let controller: MyCapitalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MyCapitalController],
      providers: [MyCapitalService],
    }).compile();

    controller = module.get<MyCapitalController>(MyCapitalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
