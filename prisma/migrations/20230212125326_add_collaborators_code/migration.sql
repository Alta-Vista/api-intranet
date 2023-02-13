/*
  Warnings:

  - A unique constraint covering the columns `[cod_assessor]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cod_interno]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "usuarios"."colaboradores_generos" AS ENUM ('MASCULINO', 'FEMININO');

-- CreateEnum
CREATE TYPE "usuarios"."f_b_s" AS ENUM ('FRONT', 'BACK', 'SALES');

-- CreateEnum
CREATE TYPE "usuarios"."regime_contrato" AS ENUM ('CLT', 'ASSOCIADO');

-- AlterTable
ALTER TABLE "usuarios"."usuarios" ADD COLUMN     "cod_assessor" VARCHAR(10),
ADD COLUMN     "cod_interno" SERIAL NOT NULL;

-- CreateTable
CREATE TABLE "escritorios"."filiais_equipes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nome" VARCHAR NOT NULL,
    "id_lider" UUID,
    "id_filial" UUID,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "dt_criacao" DATE NOT NULL,
    "dt_encerramento" DATE,

    CONSTRAINT "filiais_equipes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios"."colaboradores_funcoes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "funcao" TEXT NOT NULL,

    CONSTRAINT "colaboradores_funcoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios"."colaboradores_informacoes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_colaborador" UUID NOT NULL,
    "rg" VARCHAR(20),
    "cpf" VARCHAR(15),
    "dt_nascimento" DATE,
    "genero" "usuarios"."colaboradores_generos",
    "f_b_s" "usuarios"."f_b_s",
    "id_filial" UUID,
    "id_equipe" UUID,
    "id_funcao" UUID,
    "banco_pagamento" VARCHAR(100),
    "ag" VARCHAR(10),
    "conta" VARCHAR(20),
    "regime_contrato" "usuarios"."regime_contrato",
    "empresa_anterior" VARCHAR,
    "dt_entrada_av" DATE,
    "dt_entrada_xp" DATE,
    "dt_saida_av" DATE,

    CONSTRAINT "colaboradores_informacoes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "colaboradores_funcoes_funcao_key" ON "usuarios"."colaboradores_funcoes"("funcao");

-- CreateIndex
CREATE UNIQUE INDEX "colaboradores_informacoes_rg_key" ON "usuarios"."colaboradores_informacoes"("rg");

-- CreateIndex
CREATE UNIQUE INDEX "colaboradores_informacoes_cpf_key" ON "usuarios"."colaboradores_informacoes"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_cod_assessor_key" ON "usuarios"."usuarios"("cod_assessor");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_cod_interno_key" ON "usuarios"."usuarios"("cod_interno");

-- AddForeignKey
ALTER TABLE "escritorios"."filiais_equipes" ADD CONSTRAINT "fk_lider_equipe" FOREIGN KEY ("id_lider") REFERENCES "usuarios"."usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "escritorios"."filiais_equipes" ADD CONSTRAINT "fk_equipe_filial" FOREIGN KEY ("id_filial") REFERENCES "escritorios"."filiais"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios"."colaboradores_informacoes" ADD CONSTRAINT "fk_colaborador_filial" FOREIGN KEY ("id_filial") REFERENCES "escritorios"."filiais"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios"."colaboradores_informacoes" ADD CONSTRAINT "fk_colaborador_info" FOREIGN KEY ("id_colaborador") REFERENCES "usuarios"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios"."colaboradores_informacoes" ADD CONSTRAINT "fk_colaborador_funcao" FOREIGN KEY ("id_funcao") REFERENCES "usuarios"."colaboradores_funcoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios"."colaboradores_informacoes" ADD CONSTRAINT "fk_colaborador_equipe" FOREIGN KEY ("id_equipe") REFERENCES "escritorios"."filiais_equipes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
