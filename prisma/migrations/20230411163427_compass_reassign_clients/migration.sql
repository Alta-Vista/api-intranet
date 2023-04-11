-- CreateTable
CREATE TABLE "compass"."compass_reatribuicoes_clientes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_solicitacao" UUID NOT NULL,
    "cliente" INTEGER NOT NULL,
    "cod_a_origem" VARCHAR,
    "cod_a_compass" VARCHAR,
    "cod_a_destino" VARCHAR,
    "status" "compass"."compass_status" NOT NULL,
    "mensagem" VARCHAR,
    "dt_atualizacao" TIMESTAMP(6),

    CONSTRAINT "compass_reatribuicoes_clientes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "compass"."compass_reatribuicoes_clientes" ADD CONSTRAINT "fk_compass_cod_a_origem" FOREIGN KEY ("cod_a_origem") REFERENCES "usuarios"."usuarios"("cod_assessor") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compass"."compass_reatribuicoes_clientes" ADD CONSTRAINT "fk_compass_cod_a_compass" FOREIGN KEY ("cod_a_compass") REFERENCES "usuarios"."usuarios"("cod_assessor") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compass"."compass_reatribuicoes_clientes" ADD CONSTRAINT "fk_compass_cod_a_destino" FOREIGN KEY ("cod_a_destino") REFERENCES "usuarios"."usuarios"("cod_assessor") ON DELETE CASCADE ON UPDATE CASCADE;
