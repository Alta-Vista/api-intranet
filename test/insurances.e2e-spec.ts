import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { InsurancesModule } from '../src/insurances/insurances.module';
import { PrismaService } from '../src/database/prisma.service';

describe('InsuranceController (e2e)', () => {
  let app: INestApplication;
  const prismaService = new PrismaService();

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [InsurancesModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // beforeAll(async () => {});

  it('/insurer (POST)', () => {
    return request(app.getHttpServer())
      .post('/admin/insurances/insurer')
      .send({ insurer: 'Mongeral' })
      .expect(201);
  });

  it('/clients (GET)', async () => {
    const res = await request(app.getHttpServer())
      .get('/admin/insurances/clients')
      .expect(200);

    expect(res.body.clients).toBeDefined();
  });

  afterAll(async () => {
    const deleteInsurers = prismaService.seguradoras.deleteMany();

    await prismaService.$transaction([deleteInsurers]);

    await prismaService.$disconnect();

    await app.close();
  });
});
