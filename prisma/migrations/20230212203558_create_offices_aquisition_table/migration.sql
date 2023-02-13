-- CreateTable
CREATE TABLE "escritorios"."escritorios_aquisicoes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "operacao" VARCHAR NOT NULL,
    "dt_aquisicao" DATE NOT NULL,

    CONSTRAINT "escritorios_aquisicoes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "escritorios_aquisicoes_operacao_key" ON "escritorios"."escritorios_aquisicoes"("operacao");
