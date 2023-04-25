-- CreateTable
CREATE TABLE "compass"."clientes_compass" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "cliente" INTEGER NOT NULL,
    "cod_a_origem" VARCHAR NOT NULL,
    "cod_a_compass" VARCHAR,
    "disponivel" BOOLEAN NOT NULL DEFAULT false,
    "patrimonio_xp" DECIMAL(10,2) NOT NULL,
    "cidade" VARCHAR NOT NULL,
    "estado" VARCHAR(2) NOT NULL,
    "cliente_ciente" BOOLEAN NOT NULL,
    "dt_criacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "em_devolucao" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "clientes_compass_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clientes_compass_cliente_key" ON "compass"."clientes_compass"("cliente");

-- AddForeignKey
ALTER TABLE "compass"."clientes_compass" ADD CONSTRAINT "clientes_compass_cod_a_compass_fkey" FOREIGN KEY ("cod_a_compass") REFERENCES "usuarios"."usuarios"("cod_assessor") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compass"."clientes_compass" ADD CONSTRAINT "clientes_compass_cod_a_origem_fkey" FOREIGN KEY ("cod_a_origem") REFERENCES "usuarios"."usuarios"("cod_assessor") ON DELETE CASCADE ON UPDATE CASCADE;
