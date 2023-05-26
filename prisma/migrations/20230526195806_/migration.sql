-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "mesa_rv";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "seguros";

-- CreateEnum
CREATE TYPE "seguros"."seguros_tipo_clientes" AS ENUM ('XP', 'EXTERNO');

-- CreateEnum
CREATE TYPE "seguros"."seguros_peridiocidade" AS ENUM ('MENSAL', 'ANUAL', 'UNICA', 'SEMESTRAL');

-- CreateEnum
CREATE TYPE "mesa_rv"."tp_ativo" AS ENUM ('FII', 'ACAO');

-- CreateTable
CREATE TABLE "seguros"."seguradoras" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "seguradora" VARCHAR NOT NULL,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "dt_criacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dt_atualizacao" TIMESTAMP,

    CONSTRAINT "seguradoras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seguros"."seguradoras_produtos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nome" VARCHAR NOT NULL,
    "comissao_percentual" DECIMAL(10,2) NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "id_seguradora" UUID,
    "dt_criacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dt_atualizacao" TIMESTAMP,

    CONSTRAINT "seguradoras_produtos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seguros"."seguros_clientes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nome" VARCHAR NOT NULL,
    "cod_xp" INTEGER,
    "cpf" VARCHAR,
    "cod_interno" VARCHAR,
    "cod_a" VARCHAR NOT NULL,
    "tp_cliente" "seguros"."seguros_tipo_clientes" NOT NULL,
    "dt_criacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "seguros_clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seguros"."seguros_clientes_planos_etapas" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "etapa" VARCHAR NOT NULL,
    "dt_criacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dt_atualizacao" TIMESTAMP,

    CONSTRAINT "seguros_clientes_planos_etapas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seguros"."seguros_clientes_planos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_cliente" UUID NOT NULL,
    "cod_a" VARCHAR NOT NULL,
    "id_consultor" UUID,
    "id_seguradora" UUID,
    "id_equipe" UUID,
    "id_filial" UUID,
    "pi" DECIMAL(10,2),
    "pa" DECIMAL(10,2),
    "origem_alocacao" BOOLEAN NOT NULL,
    "comissao_percentual" DECIMAL(10,2),
    "total_comissao" DECIMAL(10,2),
    "periodicidade" "seguros"."seguros_peridiocidade" NOT NULL,
    "id_etapa" UUID,
    "id_produto" UUID,
    "dt_indicacao" TIMESTAMP,
    "dt_up_plataforma" TIMESTAMP,
    "dt_implementacao" TIMESTAMP,
    "dt_pagamento" TIMESTAMP,

    CONSTRAINT "seguros_clientes_planos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mesa_rv"."mesa_rv_clientes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "cliente" INTEGER NOT NULL,
    "cod_a" VARCHAR NOT NULL,
    "dt_criacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mesa_rv_clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mesa_rv"."mesa_rv_cart_automatizada_solcitacoes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "cliente" INTEGER,
    "cod_a" VARCHAR NOT NULL,
    "ativo" VARCHAR NOT NULL,
    "tipo" "mesa_rv"."tp_ativo" NOT NULL,
    "qtd_atual" INTEGER NOT NULL,
    "valor_total_atual" DECIMAL(10,2) NOT NULL,
    "executado" BOOLEAN NOT NULL DEFAULT false,
    "total_solicitado" DECIMAL(10,2) NOT NULL,
    "dt_solicitacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mesa_rv_cart_automatizada_solcitacoes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "seguradoras_seguradora_key" ON "seguros"."seguradoras"("seguradora");

-- CreateIndex
CREATE UNIQUE INDEX "seguros_clientes_cod_xp_key" ON "seguros"."seguros_clientes"("cod_xp");

-- CreateIndex
CREATE UNIQUE INDEX "seguros_clientes_cpf_key" ON "seguros"."seguros_clientes"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "seguros_clientes_cod_interno_key" ON "seguros"."seguros_clientes"("cod_interno");

-- CreateIndex
CREATE UNIQUE INDEX "seguros_clientes_planos_etapas_etapa_key" ON "seguros"."seguros_clientes_planos_etapas"("etapa");

-- CreateIndex
CREATE UNIQUE INDEX "mesa_rv_clientes_cliente_key" ON "mesa_rv"."mesa_rv_clientes"("cliente");

-- AddForeignKey
ALTER TABLE "seguros"."seguradoras_produtos" ADD CONSTRAINT "fk_seguradoras_produtos" FOREIGN KEY ("id_seguradora") REFERENCES "seguros"."seguradoras"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seguros"."seguros_clientes" ADD CONSTRAINT "fk_assessor_seguros_clientes" FOREIGN KEY ("cod_a") REFERENCES "usuarios"."usuarios"("cod_assessor") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seguros"."seguros_clientes_planos" ADD CONSTRAINT "fk_clientes_seguros_produtos" FOREIGN KEY ("id_cliente") REFERENCES "seguros"."seguros_clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seguros"."seguros_clientes_planos" ADD CONSTRAINT "fk_clientes_planos_assessores" FOREIGN KEY ("cod_a") REFERENCES "usuarios"."usuarios"("cod_assessor") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seguros"."seguros_clientes_planos" ADD CONSTRAINT "fk_consultor_clientes_planos" FOREIGN KEY ("id_consultor") REFERENCES "usuarios"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seguros"."seguros_clientes_planos" ADD CONSTRAINT "fk_planos_etapas" FOREIGN KEY ("id_etapa") REFERENCES "seguros"."seguros_clientes_planos_etapas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seguros"."seguros_clientes_planos" ADD CONSTRAINT "fk_planos_produtos" FOREIGN KEY ("id_produto") REFERENCES "seguros"."seguradoras_produtos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seguros"."seguros_clientes_planos" ADD CONSTRAINT "fk_planos_filiais_quipes" FOREIGN KEY ("id_equipe") REFERENCES "escritorios"."filiais_equipes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seguros"."seguros_clientes_planos" ADD CONSTRAINT "fk_planos_filiais" FOREIGN KEY ("id_filial") REFERENCES "escritorios"."filiais"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mesa_rv"."mesa_rv_cart_automatizada_solcitacoes" ADD CONSTRAINT "fk_clientes_cart_automatizada_solcitacoes" FOREIGN KEY ("cliente") REFERENCES "mesa_rv"."mesa_rv_clientes"("cliente") ON DELETE SET NULL ON UPDATE CASCADE;
