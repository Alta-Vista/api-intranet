-- AddForeignKey
ALTER TABLE "mesa_rv"."mesa_rv_cart_auto_soli" ADD CONSTRAINT "fk_solicitacoes_assessores" FOREIGN KEY ("cod_a") REFERENCES "usuarios"."usuarios"("cod_assessor") ON DELETE CASCADE ON UPDATE CASCADE;
