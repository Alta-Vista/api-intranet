/*
  Warnings:

  - Added the required column `cliente` to the `compass_clientes_devolucao` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "compass"."compass_clientes_devolucao" ADD COLUMN     "cliente" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "compass"."compass_clientes_devolucao" ADD CONSTRAINT "fk_clientes_devolucoes" FOREIGN KEY ("cliente") REFERENCES "compass"."clientes_compass"("cliente") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compass"."compass_clientes_devolucao" ADD CONSTRAINT "fk_assessores_origem_devolucao" FOREIGN KEY ("cod_a_origem") REFERENCES "usuarios"."usuarios"("cod_assessor") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compass"."compass_clientes_devolucao" ADD CONSTRAINT "fk_assessores_compass_devolucao" FOREIGN KEY ("cod_a_compass") REFERENCES "usuarios"."usuarios"("cod_assessor") ON DELETE CASCADE ON UPDATE CASCADE;
