-- AlterTable
ALTER TABLE "escritorios"."filiais" ADD COLUMN     "ativa" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "cidade" VARCHAR,
ADD COLUMN     "dt_encerramento" DATE,
ADD COLUMN     "estado" VARCHAR(2),
ADD COLUMN     "nome" VARCHAR;
