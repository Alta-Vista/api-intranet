-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "mycapital";

-- CreateEnum
CREATE TYPE "mycapital"."mycapital_status" AS ENUM ('ERRO', 'SUCESSO', 'SOLICITADO');

-- CreateEnum
CREATE TYPE "mycapital"."mycapital_pagador" AS ENUM ('CLIENTE', 'ASSESSOR', 'SUBSIDIO');

-- CreateTable
CREATE TABLE "mycapital"."mycapital_solicitacoes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_solicitante" UUID NOT NULL,
    "dt_solicitacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mycapital_solicitacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mycapital"."mycapital_clientes_solicitacoes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_solicitacao" UUID NOT NULL,
    "cod_cliente" INTEGER NOT NULL,
    "pagador" "mycapital"."mycapital_pagador" NOT NULL,
    "status" "mycapital"."mycapital_status" NOT NULL DEFAULT 'SOLICITADO',
    "erro" VARCHAR,
    "dt_criacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dt_atualizacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mycapital_clientes_solicitacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mycapital"."mycapital_clientes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_cliente_solicitacao" UUID,
    "nome" VARCHAR NOT NULL,
    "codigo" INTEGER NOT NULL,
    "cod_a" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "cpf_cnpj" VARCHAR NOT NULL,
    "pagador" "mycapital"."mycapital_pagador" NOT NULL,
    "dt_criacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dt_atualizacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mycapital_clientes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mycapital_clientes_codigo_key" ON "mycapital"."mycapital_clientes"("codigo");

-- AddForeignKey
ALTER TABLE "mycapital"."mycapital_solicitacoes" ADD CONSTRAINT "fk_solicitante_mycapital_solicitacoes" FOREIGN KEY ("id_solicitante") REFERENCES "usuarios"."usuarios"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mycapital"."mycapital_clientes_solicitacoes" ADD CONSTRAINT "fk_clientes_solicitacoes" FOREIGN KEY ("id_solicitacao") REFERENCES "mycapital"."mycapital_solicitacoes"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mycapital"."mycapital_clientes" ADD CONSTRAINT "fk_solicitacoes_clientes" FOREIGN KEY ("id_cliente_solicitacao") REFERENCES "mycapital"."mycapital_clientes_solicitacoes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mycapital"."mycapital_clientes" ADD CONSTRAINT "fk_assessores_mycapital_clientes" FOREIGN KEY ("cod_a") REFERENCES "usuarios"."usuarios"("cod_assessor") ON DELETE NO ACTION ON UPDATE CASCADE;
