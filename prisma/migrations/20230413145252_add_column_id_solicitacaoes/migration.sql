/*
  Warnings:

  - A unique constraint covering the columns `[id_solicitacoes_clientes]` on the table `clientes_compass` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "compass"."clientes_compass" ADD COLUMN     "id_solicitacoes_clientes" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "clientes_compass_id_solicitacoes_clientes_key" ON "compass"."clientes_compass"("id_solicitacoes_clientes");

-- AddForeignKey
ALTER TABLE "compass"."clientes_compass" ADD CONSTRAINT "fk_solicitacoes_clientes" FOREIGN KEY ("id_solicitacoes_clientes") REFERENCES "compass"."compass_solicitacoes_clientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
