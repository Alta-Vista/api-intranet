-- CreateTable
CREATE TABLE "compass"."compass_clientes_devolucao" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_solicitante" UUID NOT NULL,
    "cod_a_origem" VARCHAR NOT NULL,
    "cod_a_compass" VARCHAR NOT NULL,
    "motivo" VARCHAR NOT NULL,
    "status" "compass"."compass_status" NOT NULL,
    "mensagem" VARCHAR,
    "dt_solicitacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dt_atualizacao" TIMESTAMP,
    "dt_devolucao" TIMESTAMP,

    CONSTRAINT "compass_clientes_devolucao_pkey" PRIMARY KEY ("id")
);
