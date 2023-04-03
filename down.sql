yarn run v1.22.19
$ /home/jin/projetos/altavista/api/node_modules/.bin/prisma migrate diff --from-schema-datamodel prisma/schema.prisma --to-schema-datasource prisma/schema.prisma --script
-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "plpgsql" WITH SCHEMA "pg_catalog" VERSION "1.0";

-- AlterTable
ALTER TABLE "escritorios"."filiais" ALTER COLUMN "nome" SET NOT NULL,
ALTER COLUMN "dt_encerramento" SET NOT NULL,
ALTER COLUMN "estado" SET NOT NULL,
ALTER COLUMN "cidade" SET NOT NULL;

Done in 2.45s.
