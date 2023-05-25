-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "mesa_rv";

-- CreateEnum
CREATE TYPE "mesa_rv"."tp_ativo" AS ENUM ('FII', 'ACAO');

-- CreateTable
CREATE TABLE "mesa_rv"."clientes_mesa_rv" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "cliente" INTEGER NOT NULL,
    "cod_a" VARCHAR NOT NULL,
    "dt_criacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clientes_mesa_rv_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mesa_rv"."clientes_solicitacao_ativos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "cliente" INTEGER NOT NULL,
    "cod_a" VARCHAR NOT NULL,
    "ativo" VARCHAR NOT NULL,
    "tipo" "mesa_rv"."tp_ativo" NOT NULL,
    "qtd_atual" INTEGER NOT NULL,
    "valor_total_atual" DECIMAL(10,2) NOT NULL,
    "carteira_adm" BOOLEAN NOT NULL,
    "total_solicitado" DECIMAL(10,2) NOT NULL,
    "dt_solicitacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clientes_solicitacao_ativos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clientes_mesa_rv_cliente_key" ON "mesa_rv"."clientes_mesa_rv"("cliente");
