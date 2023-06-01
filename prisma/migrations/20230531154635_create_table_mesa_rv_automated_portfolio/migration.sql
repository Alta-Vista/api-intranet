-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "mesa_rv";

-- CreateEnum
CREATE TYPE "mesa_rv"."mesa_rv_status" AS ENUM ('ERRO', 'SOLICITADO', 'SUCESSO', 'EM_ANDAMENTO');

-- CreateEnum
CREATE TYPE "mesa_rv"."tp_ativo" AS ENUM ('FII', 'ACAO');

-- CreateTable
CREATE TABLE "mesa_rv"."mesa_rv_carteiras_automatizadas" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nome" VARCHAR NOT NULL,
    "apli_min" DECIMAL(10,2) NOT NULL,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "dt_criacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dt_atualizacao" TIMESTAMP,

    CONSTRAINT "mesa_rv_carteiras_automatizadas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mesa_rv"."mesa_rv_cart_auto_soli" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "cliente" INTEGER NOT NULL,
    "cod_a" VARCHAR NOT NULL,
    "id_carteira" UUID NOT NULL,
    "mensagem" VARCHAR,
    "dt_criacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dt_atualizacao" TIMESTAMP NOT NULL,

    CONSTRAINT "mesa_rv_cart_auto_soli_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mesa_rv"."mesa_rv_cart_auto_soli_ativos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_solicitacao" UUID NOT NULL,
    "ativo" VARCHAR NOT NULL,
    "status" "mesa_rv"."mesa_rv_status" NOT NULL,
    "tipo" "mesa_rv"."tp_ativo" NOT NULL,
    "qtd_atual" INTEGER NOT NULL,
    "valor_total_atual" DECIMAL(10,2) NOT NULL,
    "total_solicitado" DECIMAL(10,2) NOT NULL,
    "mensagem" VARCHAR,

    CONSTRAINT "mesa_rv_cart_auto_soli_ativos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mesa_rv_carteiras_automatizadas_nome_key" ON "mesa_rv"."mesa_rv_carteiras_automatizadas"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "mesa_rv_cart_auto_soli_cliente_key" ON "mesa_rv"."mesa_rv_cart_auto_soli"("cliente");

-- AddForeignKey
ALTER TABLE "mesa_rv"."mesa_rv_cart_auto_soli" ADD CONSTRAINT "fk_solicitacoes_carteira" FOREIGN KEY ("id_carteira") REFERENCES "mesa_rv"."mesa_rv_carteiras_automatizadas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mesa_rv"."mesa_rv_cart_auto_soli_ativos" ADD CONSTRAINT "fk_clientes_cart_automatizada_solcitacoes" FOREIGN KEY ("id_solicitacao") REFERENCES "mesa_rv"."mesa_rv_cart_auto_soli"("id") ON DELETE CASCADE ON UPDATE CASCADE;
