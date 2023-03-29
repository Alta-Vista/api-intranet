-- CreateEnum
CREATE TYPE "compass"."compass_status" AS ENUM ('ATRIBUIDO', 'SOLICITADO', 'ERRO');

-- CreateTable
CREATE TABLE "compass"."compass_solicitacoes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_solicitante" UUID NOT NULL,
    "dt_solicitacao" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "compass_solicitacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compass"."compass_solicitacoes_clientes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_solicitacao" UUID NOT NULL,
    "cod_assessor" VARCHAR NOT NULL,
    "cliente" INTEGER NOT NULL,
    "status" "compass"."compass_status" NOT NULL,
    "mensagem" VARCHAR,
    "dt_solicitacao" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dt_atualizacao" TIMESTAMP(6),

    CONSTRAINT "compass_solicitacoes_clientes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "compass"."compass_solicitacoes" ADD CONSTRAINT "fk_colaboradores_compass_solicitacoes" FOREIGN KEY ("id_solicitante") REFERENCES "usuarios"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compass"."compass_solicitacoes_clientes" ADD CONSTRAINT "fk_compass_clientes_solicitacoes" FOREIGN KEY ("id_solicitacao") REFERENCES "compass"."compass_solicitacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compass"."compass_solicitacoes_clientes" ADD CONSTRAINT "fk_compass_colaboradores_clientes_solicitacoes" FOREIGN KEY ("cod_assessor") REFERENCES "usuarios"."usuarios"("cod_assessor") ON DELETE CASCADE ON UPDATE CASCADE;
