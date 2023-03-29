import { Test, TestingModule } from '@nestjs/testing';
import { OfficesService } from './offices.service';
import { PrismaModule } from '../database/prisma.module';
import { OfficesController } from './offices.controller';
import { OfficesRepository } from './offices.repository';
import { ConfigModule } from '@nestjs/config';

describe('OfficesService', () => {
  let service: OfficesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, ConfigModule.forRoot()],
      controllers: [OfficesController],
      providers: [OfficesService, OfficesRepository],
    }).compile();

    service = module.get<OfficesService>(OfficesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
