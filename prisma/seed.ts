import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const userId = '93f7bad7-6f97-4685-bd1d-3caa5d1da7d6';
  const insuranceBrokerId = '62fc92d1-d907-4a09-b4cf-2b3e67723fa4';

  await prisma.usuarios.upsert({
    where: { id: insuranceBrokerId },
    update: {},
    create: {
      id: insuranceBrokerId,
      email: 'jonny.doe@altavistainvest.com.br',
      nome: 'Jonny',
      sobrenome: 'Doe',
    },
  });

  await prisma.usuarios.upsert({
    where: { id: userId },
    update: {},
    create: {
      id: userId,
      email: 'john.doe@altavistainvest.com.br',
      nome: 'John',
      sobrenome: 'Doe',
      cod_assessor: 'A123456',
    },
  });

  await prisma.estados.upsert({
    where: { estado: 'São Paulo' },
    update: {},
    create: {
      estado: 'São Paulo',
      uf: 'SP',
      id: '8f2b6321-ca61-405d-bea3-0022c5f435cf',
    },
  });

  const cidade = await prisma.cidades.upsert({
    where: {
      cidade: 'São Paulo',
    },
    update: {},
    create: {
      cidade: 'São Paulo',
      id: '20fcc24f-5cdf-44ff-97a4-119b12e703a5',
      id_estado: '8f2b6321-ca61-405d-bea3-0022c5f435cf',
    },
  });

  const branch = await prisma.filiais.upsert({
    where: { id: 'b45a6406-501f-4d53-923b-48e62b07d751' },
    update: {},
    create: {
      id: 'b45a6406-501f-4d53-923b-48e62b07d751',
      ativa: true,
      cidade: 'São Paulo',
      estado: 'SP',
      nome: 'São Paulo',
      id_responsavel: userId,
      id_cidade: cidade.id,
    },
  });

  const team = await prisma.filiais_equipes.upsert({
    where: { id: '93e96a15-8b76-406a-8ab3-90cba29fb887' },
    update: {},
    create: {
      id: '93e96a15-8b76-406a-8ab3-90cba29fb887',
      nome: 'Time John',
      ativa: true,
      id_lider: userId,
      id_filial: branch.id,
      dt_criacao: new Date(),
    },
  });

  await prisma.colaboradores_informacoes.upsert({
    where: { id_colaborador: userId },
    update: {
      id_colaborador: userId,
      id_filial: branch.id,
      id_equipe: team.id,
    },
    create: {
      id_colaborador: userId,
      id_filial: branch.id,
      id_equipe: team.id,
    },
  });

  await prisma.mesa_rv_carteiras_automatizadas.upsert({
    where: { nome: 'Carteira Alta Vista' },
    update: {},
    create: {
      apli_min: 10000,
      nome: 'Carteira Alta Vista',
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);

    await prisma.$disconnect();

    process.exit(1);
  });
