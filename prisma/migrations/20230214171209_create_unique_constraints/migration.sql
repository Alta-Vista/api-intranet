/*
  Warnings:

  - A unique constraint covering the columns `[id_usuario]` on the table `enderecos` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_filial]` on the table `enderecos` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "enderecos_id_usuario_key" ON "localizacoes"."enderecos"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "enderecos_id_filial_key" ON "localizacoes"."enderecos"("id_filial");
