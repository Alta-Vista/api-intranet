import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { InsurancesModule } from '../src/insurances/insurances.module';
import { PrismaService } from '../src/database/prisma.service';
import axios from 'axios';
import { Decimal } from '@prisma/client/runtime';

type Insurer = {
  id: string;
  seguradora: string;
  ativa: boolean;
  dt_criacao: Date;
  dt_atualizacao: Date | null;
};

type InsuranceProduct = {
  id: string;
  nome: string;
  comissao_percentual: Decimal;
  ativo: boolean;
  id_seguradora: string;
  dt_criacao: Date;
  dt_atualizacao: Date | null;
};

type Client = {
  id: string;
  nome: string;
  cod_xp: number;
  cpf: string | null;
  cod_interno: string | null;
  cod_a: string;
  tp_cliente: string;
  dt_criacao: Date;
};

type PlanStep = {
  id: string;
  etapa: string;
  dt_criacao: Date;
  dt_atualizacao: Date | null;
};

describe('InsuranceController (e2e)', () => {
  let app: INestApplication;
  const prismaService = new PrismaService();
  let token: string;
  let insurer: Insurer;
  let client: Client;
  let insurerProduct: InsuranceProduct;
  let planStep: PlanStep;

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

    insurer = await prismaService.seguradoras.create({
      data: {
        seguradora: 'Icatu',
      },
    });

    await prismaService.usuarios.createMany({
      data: [
        {
          nome: 'Philip',
          sobrenome: 'Mark',
          email: 'philip.mark@altavistainvest.com.br',
          id: '93f7bad7-6f97-4685-bd1d-3caa5d1da7d6',
          cod_assessor: 'A123456',
        },
        {
          nome: 'Jeo',
          sobrenome: 'San',
          email: 'joe.san@altavistainvest.com.br',
          id: '75992f3f-39e6-4682-a0eb-c75402092b7a',
        },
      ],
    });

    insurerProduct = await prismaService.seguradoras_produtos.create({
      data: {
        nome: 'Seguro Residencial',
        comissao_percentual: 10,
        id_seguradora: insurer.id,
      },
    });

    planStep = await prismaService.seguros_clientes_planos_etapas.create({
      data: {
        etapa: 'Primeira reunião',
      },
    });

    client = await prismaService.seguros_clientes.create({
      data: {
        nome: 'John Doe',
        cod_a: 'A123456',
        tp_cliente: 'XP',
        cod_xp: 123456,
      },
    });
  });

  it('/insurances/clients (POST)', (done) => {
    const data = {
      xp_code: 1234567,
      advisor_code: 'A123456',
      client_type: 'XP',
      name: 'John Average',
    };

    request(app.getHttpServer())
      .post('/admin/insurances/clients')
      .send(data)
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .expect(201)
      .end((err) => {
        if (err) return done(err);

        return done();
      });
  });

  it('/insurance/insurer (POST)', (done) => {
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

  it('/insurance/insurer/product (POST)', (done) => {
    const data = {
      product: 'Seguro de vida',
      insurer_id: insurer.id,
      commission: 10,
    };

    request(app.getHttpServer())
      .post('/admin/insurances/insurer/product')
      .send(data)
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .expect(201)
      .end((err) => {
        if (err) return done(err);

        return done();
      });
  });

  it('/insurance/plans/step (POST)', (done) => {
    const data = 'Pendente de pagamento';

    request(app.getHttpServer())
      .post('/admin/insurances/plans/step')
      .send({ step: data })
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .expect(201)
      .end((err) => {
        if (err) return done(err);

        return done();
      });
  });

  it('/insurance/plans/step (POST)', (done) => {
    const data = {
      client_id: client.id,
      consultant_id: '75992f3f-39e6-4682-a0eb-c75402092b7a',
      advisor: 'A123456',
      insurer_id: insurer.id,
      product_id: insurerProduct.id,
      from_allocation: false,
      commission_percentage: insurerProduct.comissao_percentual,
      total_commission: 100,
      step_id: planStep.id,
      frequency: 'MENSAL',
    };

    request(app.getHttpServer())
      .post('/admin/insurances/plans')
      .send(data)
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .expect(201)
      .end((err) => {
        if (err) return done(err);

        return done();
      });
  });

  it('/insurance/clients (GET)', async () => {
    const res = await request(app.getHttpServer())
      .get('/admin/insurances/clients')
      .set('Authorization', token)
      .set('Content-Type', 'application/json')
      .expect(200);

    expect(res.body).toHaveProperty('clients');
  });

  afterAll(async () => {
    const deleteInsurances = prismaService.seguradoras.deleteMany();
    const deleteInsurancesProduct =
      prismaService.seguradoras_produtos.deleteMany();
    const deleteCollaborators = prismaService.usuarios.deleteMany();
    const deleteInsurancePlans =
      prismaService.seguros_clientes_planos_etapas.deleteMany();
    const deleteInsuranceClients = prismaService.seguros_clientes.deleteMany();
    const deleteInsuranceClientsPlan =
      prismaService.seguros_clientes_planos.deleteMany();

    await prismaService.$transaction([
      deleteInsurances,
      deleteInsurancesProduct,
      deleteCollaborators,
      deleteInsurancePlans,
      deleteInsuranceClientsPlan,
      deleteInsuranceClients,
    ]);

    await prismaService.$disconnect();

    await app.close();
  });
});
