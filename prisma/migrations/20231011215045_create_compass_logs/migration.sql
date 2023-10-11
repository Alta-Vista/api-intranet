-- CreateTable
CREATE TABLE "compass"."compass_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "mensagem" VARCHAR NOT NULL,
    "tipo" VARCHAR NOT NULL,
    "log" JSONB NOT NULL,
    "resolvido" BOOLEAN NOT NULL DEFAULT false,
    "dt_criacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dt_atualizacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "compass_logs_pkey" PRIMARY KEY ("id")
);
