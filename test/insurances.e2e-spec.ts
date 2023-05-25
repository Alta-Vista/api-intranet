import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { InsurancesModule } from '../src/insurances/insurances.module';
import { PrismaService } from '../src/database/prisma.service';
import axios from 'axios';

describe('InsuranceController (e2e)', () => {
  let app: INestApplication;
  const prismaService = new PrismaService();
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [InsurancesModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const { data } = await axios.post(
      `https://${process.env.AUTH_DOMAIN}/oauth/token`,
      {
        grant_type: 'password',
        username: process.env.AUTH_USERNAME,
        password: process.env.AUTH_PASSWORD,
        audience: process.env.AUTH_AUDIENCE,
        connection: process.env.AUTH_CONNECTION,
        client_id: process.env.AUTH_CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
      },
    );

    token = `Bearer ${data.access_token}`;
  });

  it('/insurer (POST)', (done) => {
    request(app.getHttpServer())
      .post('/admin/insurances/insurer')
      .send({ insurer: 'Mongeral' })
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .expect(201)
      .end((err) => {
        if (err) return done(err);

        return done();
      });
  });

  it('/clients (GET)', async () => {
    const res = await request(app.getHttpServer())
      .get('/admin/insurances/clients')
      .set('Authorization', token)
      .set('Content-Type', 'application/json')
      .expect(200);

    expect(res.body.clients).toEqual([]);
  });

  afterAll(async () => {
    await prismaService.seguradoras.deleteMany();

    await prismaService.$disconnect();

    await app.close();
  });
});
