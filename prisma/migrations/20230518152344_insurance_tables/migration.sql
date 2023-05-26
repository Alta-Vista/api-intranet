-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "seguros";

-- CreateEnum
CREATE TYPE "seguros"."seguros_tipo_clientes" AS ENUM ('XP', 'EXTERNO');

-- CreateEnum
CREATE TYPE "seguros"."seguros_peridiocidade" AS ENUM ('MENSAL', 'ANUAL', 'UNICA', 'SEMESTRAL');

-- CreateTable
CREATE TABLE "seguros"."seguradoras" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "seguradora" TEXT NOT NULL,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "dt_criacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dt_atualizacao" TIMESTAMP,

    CONSTRAINT "seguradoras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seguros"."produtos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nome" VARCHAR NOT NULL,
    "comissao_percentual" DECIMAL(10,2) NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "id_seguradora" UUID,
    "dt_criacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dt_atualizacao" TIMESTAMP,

    CONSTRAINT "produtos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seguros"."clientes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nome" VARCHAR NOT NULL,
    "cod_xp" INTEGER,
    "cpf" VARCHAR,
    "cod_interno" VARCHAR,
    "cod_a" VARCHAR NOT NULL,
    "tp_cliente" "seguros"."seguros_tipo_clientes" NOT NULL,
    "dt_criacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seguros"."clientes_planos_etapas" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "etapa" VARBIT NOT NULL,
    "dt_criacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dt_atualizacao" TIMESTAMP,

    CONSTRAINT "clientes_planos_etapas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seguros"."clientes_planos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_cliente" UUID NOT NULL,
    "cod_a" VARCHAR NOT NULL,
    "id_consultor" UUID,
    "id_seguradora" UUID,
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

    CONSTRAINT "clientes_planos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "seguradoras_seguradora_key" ON "seguros"."seguradoras"("seguradora");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_cod_xp_key" ON "seguros"."clientes"("cod_xp");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_cpf_key" ON "seguros"."clientes"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_cod_interno_key" ON "seguros"."clientes"("cod_interno");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_planos_etapas_etapa_key" ON "seguros"."clientes_planos_etapas"("etapa");

-- AddForeignKey
ALTER TABLE "seguros"."produtos" ADD CONSTRAINT "fk_seguradoras_produtos" FOREIGN KEY ("id_seguradora") REFERENCES "seguros"."seguradoras"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seguros"."clientes" ADD CONSTRAINT "fk_assessor_seguros_clientes" FOREIGN KEY ("cod_a") REFERENCES "usuarios"."usuarios"("cod_assessor") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seguros"."clientes_planos" ADD CONSTRAINT "fk_clientes_seguros_produtos" FOREIGN KEY ("id_cliente") REFERENCES "seguros"."clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seguros"."clientes_planos" ADD CONSTRAINT "fk_clientes_planos_assessores" FOREIGN KEY ("cod_a") REFERENCES "usuarios"."usuarios"("cod_assessor") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seguros"."clientes_planos" ADD CONSTRAINT "fk_consultor_clientes_planos" FOREIGN KEY ("id_consultor") REFERENCES "usuarios"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seguros"."clientes_planos" ADD CONSTRAINT "fk_planos_etapas" FOREIGN KEY ("id_etapa") REFERENCES "seguros"."clientes_planos_etapas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seguros"."clientes_planos" ADD CONSTRAINT "fk_planos_produtos" FOREIGN KEY ("id_produto") REFERENCES "seguros"."produtos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
