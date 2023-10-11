/*
  Warnings:

  - You are about to drop the `clientes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `clientes_devolvidos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "compass"."clientes" DROP CONSTRAINT "fk_compass_advisor";

-- DropForeignKey
ALTER TABLE "compass"."clientes" DROP CONSTRAINT "fk_compass_client_city";

-- DropForeignKey
ALTER TABLE "compass"."clientes" DROP CONSTRAINT "fk_compass_client_state";

-- DropForeignKey
ALTER TABLE "compass"."clientes" DROP CONSTRAINT "fk_original_advisor";

-- DropForeignKey
ALTER TABLE "compass"."clientes_devolvidos" DROP CONSTRAINT "compass_advisor_fk";

-- DropForeignKey
ALTER TABLE "compass"."clientes_devolvidos" DROP CONSTRAINT "original_advisor_fk";

-- DropTable
DROP TABLE "compass"."clientes";

-- DropTable
DROP TABLE "compass"."clientes_devolvidos";
