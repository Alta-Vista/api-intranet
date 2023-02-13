/*
  Warnings:

  - You are about to drop the column `id_cidade` on the `enderecos` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "localizacoes"."enderecos" DROP CONSTRAINT "fk_city_address";

-- AlterTable
ALTER TABLE "localizacoes"."enderecos" DROP COLUMN "id_cidade",
ADD COLUMN     "localidade" VARCHAR,
ADD COLUMN     "uf" VARCHAR(2);
