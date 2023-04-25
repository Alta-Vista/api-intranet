-- AddForeignKey
ALTER TABLE "compass"."compass_reatribuicoes_clientes" ADD CONSTRAINT "fk_compass_reatribuicoes_solicitacoes" FOREIGN KEY ("id_solicitacao") REFERENCES "compass"."compass_solicitacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
