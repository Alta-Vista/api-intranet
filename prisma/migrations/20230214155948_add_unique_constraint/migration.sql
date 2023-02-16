/*
  Warnings:

  - A unique constraint covering the columns `[id_colaborador]` on the table `colaboradores_informacoes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "colaboradores_informacoes_id_colaborador_key" ON "usuarios"."colaboradores_informacoes"("id_colaborador");
