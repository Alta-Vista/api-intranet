-- CreateTable
CREATE TABLE "usuarios"."colaboradores_expansao" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_colaborador" UUID NOT NULL,
    "id_mea" UUID,
    "cod_a_tombado" VARCHAR,

    CONSTRAINT "colaboradores_expansao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "colaboradores_expansao_id_colaborador_key" ON "usuarios"."colaboradores_expansao"("id_colaborador");

-- AddForeignKey
ALTER TABLE "usuarios"."colaboradores_expansao" ADD CONSTRAINT "fk_colaborador_expansao" FOREIGN KEY ("id_colaborador") REFERENCES "usuarios"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios"."colaboradores_expansao" ADD CONSTRAINT "fk_mea_expansao" FOREIGN KEY ("id_mea") REFERENCES "escritorios"."escritorios_aquisicoes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios"."colaboradores_expansao" ADD CONSTRAINT "fk_assessor_tombamento" FOREIGN KEY ("cod_a_tombado") REFERENCES "usuarios"."usuarios"("cod_assessor") ON DELETE SET NULL ON UPDATE CASCADE;
