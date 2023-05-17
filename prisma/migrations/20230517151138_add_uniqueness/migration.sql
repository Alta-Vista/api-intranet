/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `clientes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cod_interno]` on the table `clientes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "clientes_cpf_key" ON "seguros"."clientes"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_cod_interno_key" ON "seguros"."clientes"("cod_interno");
