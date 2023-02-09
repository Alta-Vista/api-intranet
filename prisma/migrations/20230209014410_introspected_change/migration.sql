-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "clientes";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "compass";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "escritorios";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "identidades";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "localizacoes";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "marketing";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "usuarios";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateTable
CREATE TABLE "public"."migrations" (
    "id" SERIAL NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "name" VARCHAR NOT NULL,

    CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."query-result-cache" (
    "id" SERIAL NOT NULL,
    "identifier" VARCHAR,
    "time" BIGINT NOT NULL,
    "duration" INTEGER NOT NULL,
    "query" TEXT NOT NULL,
    "result" TEXT NOT NULL,

    CONSTRAINT "PK_6a98f758d8bfd010e7e10ffd3d3" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes"."clientes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "codigo" DECIMAL NOT NULL,
    "nome" VARCHAR(60) NOT NULL,
    "sobrenome" VARCHAR(150) NOT NULL,
    "email" VARCHAR(60) NOT NULL,
    "telefone" VARCHAR(50) NOT NULL,
    "id_assessor" UUID NOT NULL,
    "cliente_ativo" BOOLEAN NOT NULL,
    "dt_criacao" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_d76bf3571d906e4e86470482c08" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes"."prospects" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nome" VARCHAR NOT NULL,
    "sobrenome" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "telefone" VARCHAR(50) NOT NULL,
    "id_assessor" UUID NOT NULL,
    "convertido" BOOLEAN,
    "dt_criacao" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_9fc60d8f29db14b861e3c96568e" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compass"."clientes" (
    "id" UUID NOT NULL,
    "cd_cliente" DECIMAL NOT NULL,
    "id_assessor_origem" UUID NOT NULL,
    "id_assessor_compass" UUID,
    "disponivel" BOOLEAN NOT NULL,
    "id_estado" UUID NOT NULL,
    "id_cidade" UUID NOT NULL,
    "cliente_ciente" BOOLEAN NOT NULL,
    "dt_criacao" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dt_atualizacao" TIMESTAMP(6),
    "patrimonio" DECIMAL(10,2),
    "em_devolucao" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PK_d76bf3571d906e4e86470482c08" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compass"."clientes_devolvidos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "cd_cliente" DECIMAL NOT NULL,
    "id_assessor_origem" UUID NOT NULL,
    "id_assessor_compass" UUID NOT NULL,
    "devolvido" BOOLEAN NOT NULL DEFAULT false,
    "dt_solicitacao" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dt_devolucao" TIMESTAMP(6),

    CONSTRAINT "PK_cb72ea4db243d3818a75afade5c" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "escritorios"."departamentos" (
    "id" UUID NOT NULL,
    "departamento" VARCHAR(60) NOT NULL,
    "dt_criacao" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_6d34dc0415358a018818c683c1e" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "escritorios"."filiais" (
    "id" UUID NOT NULL,
    "id_responsavel" UUID NOT NULL,
    "id_cidade" UUID NOT NULL,
    "dt_criacao" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_9cc507f6ebfb9cdeca7f05044f5" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "escritorios"."filiais_salas" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_filial" UUID NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "qtd_limite_participantes" DECIMAL NOT NULL,
    "dt_criacao" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_293615118f9c63106ab4b982a15" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "escritorios"."filiais_salas_reservadas" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_sala" UUID NOT NULL,
    "id_reservador" UUID NOT NULL,
    "id_utilizador" UUID NOT NULL,
    "dt_reserva" DATE NOT NULL,
    "qtd_participantes" DECIMAL NOT NULL,
    "hr_inicio" TIME(6) NOT NULL,
    "hr_final" TIME(6) NOT NULL,
    "cancelado" BOOLEAN NOT NULL DEFAULT false,
    "dt_criacao" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_8ec58a82d833b763d555de8ba7e" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "escritorios"."funcoes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "funcao" VARCHAR(100),

    CONSTRAINT "funcoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "escritorios"."times" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_lider" UUID,
    "id_filial" UUID,

    CONSTRAINT "times_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identidades"."credenciais" (
    "id" UUID NOT NULL,
    "codigo" SERIAL NOT NULL,
    "senha" VARCHAR NOT NULL,
    "id_usuario" UUID NOT NULL,
    "dt_validade_senha" TIMESTAMP(6) NOT NULL,
    "dt_criacao" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_dcef20a23ab4b9c3302b418a93c" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identidades"."grupos" (
    "id" UUID NOT NULL,
    "grupo" VARCHAR NOT NULL,
    "dt_criacao" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_34de64ec8a5ecd99afb23b2bd62" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identidades"."grupos_funcoes" (
    "id" UUID NOT NULL,
    "funcao" VARCHAR NOT NULL,
    "id_grupo" UUID NOT NULL,
    "dt_criacao" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_584fa03407465524ccea06a1073" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identidades"."grupos_funcoes_permissoes" (
    "id" UUID NOT NULL,
    "permissoes" VARCHAR NOT NULL,
    "dt_criacao" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "identidades"."tokens_usuarios" (
    "id" UUID NOT NULL,
    "refresh_token" VARCHAR NOT NULL,
    "id_usuario" UUID NOT NULL,
    "dt_expiracao" TIMESTAMP(6) NOT NULL,
    "dt_criacao" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_7fd735f9d934597f0704a3e12c5" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identidades"."usuario_2fa" (
    "id_usuario" UUID NOT NULL,
    "valido" BOOLEAN NOT NULL,
    "chave" VARCHAR NOT NULL,
    "cd_validacao" VARCHAR NOT NULL,
    "dt_validacao" TIMESTAMP(6),
    "dt_criacao" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_b7e5c306317e097c9148f7a8676" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "localizacoes"."cidades" (
    "id" UUID NOT NULL,
    "cidade" VARCHAR(40) NOT NULL,
    "id_estado" UUID NOT NULL,
    "dt_criacao" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_cc606d4fea4335e32bd19f3a9fa" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "localizacoes"."enderecos" (
    "id" UUID NOT NULL,
    "id_usuario" UUID,
    "id_filial" UUID,
    "logradouro" VARCHAR NOT NULL,
    "bairro" VARCHAR NOT NULL,
    "id_cidade" UUID NOT NULL,
    "cep" VARCHAR(10) NOT NULL,
    "complemento" VARCHAR(100),
    "numero" DECIMAL(10,0) NOT NULL,
    "dt_criacao" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_208b05002dcdf7bfbad378dcac1" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "localizacoes"."estados" (
    "id" UUID NOT NULL,
    "estado" VARCHAR(40) NOT NULL,
    "uf" VARCHAR(2) NOT NULL,
    "dt_criacao" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_3d9a9f2658d5086012f27924d30" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketing"."convites" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "token" UUID NOT NULL,
    "id_eventos_convidados" UUID NOT NULL,
    "id_evento" UUID NOT NULL,
    "dt_criacao" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_56a248f8700f1843839de151869" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketing"."eventos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nome_imagem" VARCHAR NOT NULL,
    "titulo" VARCHAR NOT NULL,
    "subtitulo" VARCHAR NOT NULL,
    "slug" VARCHAR NOT NULL,
    "descricao" VARCHAR NOT NULL,
    "horario" VARCHAR NOT NULL,
    "local" VARCHAR NOT NULL,
    "qtd_vagas_total" DECIMAL,
    "qtd_vagas_restantes" DECIMAL,
    "id_tp_evento" UUID NOT NULL,
    "dt_limite_inscricao" DATE NOT NULL,
    "dt_evento" DATE NOT NULL,
    "id_filial" UUID NOT NULL,
    "cancelado" BOOLEAN NOT NULL DEFAULT false,
    "dt_cancelamento" TIMESTAMP(6),
    "dt_criacao" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_40d4a3c6a4bfd24280cb97a509e" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketing"."eventos_convidados" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_evento" UUID NOT NULL,
    "id_convidador" UUID NOT NULL,
    "id_cliente" UUID,
    "id_prospect" UUID,
    "id_tp_convidado" UUID NOT NULL,
    "id_status" UUID NOT NULL,
    "compareceu" BOOLEAN NOT NULL DEFAULT false,
    "dt_criacao" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_9bedfae88ac9633183be020c484" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketing"."status_convidado" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "status" VARCHAR(50) NOT NULL,
    "dt_criacao" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_6c3453000598ad3242259f2f0e9" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketing"."tp_convidados" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tipo_convidado" VARCHAR(50) NOT NULL,
    "dt_criacao" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_2ad3583c02395a0c3d18fd17a59" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketing"."tp_eventos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tipo_evento" VARCHAR(50) NOT NULL,
    "dt_criacao" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_afc405460e771e6c9b2f37d90d5" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios"."codigos" (
    "id" UUID NOT NULL,
    "codigo" VARCHAR(50) NOT NULL,
    "id_usuario" UUID NOT NULL,
    "id_tp_codigo" SERIAL NOT NULL,
    "dt_criacao" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_e0a52950dd0aaa80e4a6ee77f1d" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios"."estado_civil" (
    "id" SERIAL NOT NULL,
    "estado_civil" VARCHAR(50) NOT NULL,
    "dt_criacao" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_3e8a44960e29a617e353486134e" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios"."tipos_codigos" (
    "id" SERIAL NOT NULL,
    "tipo" VARCHAR(50) NOT NULL,
    "dt_criacao" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_bbf93bb2db134aaeda1ca712e0d" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios"."usuarios" (
    "id" UUID NOT NULL,
    "nome" VARCHAR NOT NULL,
    "sobrenome" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "dt_criacao" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_d7281c63c176e152e4c531594a8" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios"."usuarios_generos" (
    "id" SERIAL NOT NULL,
    "genero" VARCHAR(20) NOT NULL,

    CONSTRAINT "PK_cd465b1c8e00a6e5fba2063371f" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios"."usuarios_informacoes" (
    "id" UUID NOT NULL,
    "id_usuario" UUID NOT NULL,
    "dt_nascimento" DATE NOT NULL,
    "id_filial" UUID NOT NULL,
    "id_estado_civil" SERIAL NOT NULL,
    "id_genero" SERIAL NOT NULL,
    "dt_criacao" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_time" UUID,
    "id_assistente" UUID,
    "carteira" BOOLEAN,
    "tipo" VARCHAR,

    CONSTRAINT "PK_b499cd3c071755efd8914d67633" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios"."usuarios_tp_relacionamentos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tipo_relacionamento" VARCHAR(100) NOT NULL,

    CONSTRAINT "usuarios_tp_relacionamentos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UQ_38777c5bca00ee20f9b57bc4b38" ON "clientes"."clientes"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_f79ca31c4c49e733c3b1eabe252" ON "compass"."clientes"("cd_cliente");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_f8c1d2eff6a4b2e59dd75cb1565" ON "escritorios"."departamentos"("departamento");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_2c0b0956cdd2238d2f6a18b5274" ON "identidades"."grupos_funcoes_permissoes"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_f00ce62a3c294f402be03f7bf4b" ON "identidades"."usuario_2fa"("chave");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_34e527879d155da5b7beb0611c3" ON "identidades"."usuario_2fa"("cd_validacao");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_d1113d12ffe2554ed7dc42d87e5" ON "localizacoes"."cidades"("cidade");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_321047fd6e83a5834679b179172" ON "localizacoes"."estados"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_727d8a05d0f922861f13978ac5d" ON "localizacoes"."estados"("uf");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_103be58344b1b33629ce3daf047" ON "marketing"."convites"("token");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_4bc42aef69ca6d872611f5a891a" ON "marketing"."eventos"("titulo");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_b3ab80b72ceb937cc6810e7f5e8" ON "marketing"."eventos"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_d21daaa71ada771245e2ce451b1" ON "marketing"."status_convidado"("status");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_fae2149b9e5e6240799bee058e0" ON "usuarios"."codigos"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_9a98a7bf3dd7858929bf087a1f2" ON "usuarios"."estado_civil"("estado_civil");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_2decdbe1b295b8712c96a938db3" ON "usuarios"."tipos_codigos"("tipo");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_446adfc18b35418aac32ae0b7b5" ON "usuarios"."usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_c7c003337d39367724183587b42" ON "usuarios"."usuarios_generos"("genero");

-- AddForeignKey
ALTER TABLE "clientes"."clientes" ADD CONSTRAINT "fk_advisor_client" FOREIGN KEY ("id_assessor") REFERENCES "usuarios"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientes"."prospects" ADD CONSTRAINT "fk_advisor_prospect" FOREIGN KEY ("id_assessor") REFERENCES "usuarios"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compass"."clientes" ADD CONSTRAINT "fk_compass_advisor" FOREIGN KEY ("id_assessor_compass") REFERENCES "usuarios"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compass"."clientes" ADD CONSTRAINT "fk_compass_client_city" FOREIGN KEY ("id_cidade") REFERENCES "localizacoes"."cidades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compass"."clientes" ADD CONSTRAINT "fk_compass_client_state" FOREIGN KEY ("id_estado") REFERENCES "localizacoes"."estados"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compass"."clientes" ADD CONSTRAINT "fk_original_advisor" FOREIGN KEY ("id_assessor_origem") REFERENCES "usuarios"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compass"."clientes_devolvidos" ADD CONSTRAINT "compass_advisor_fk" FOREIGN KEY ("id_assessor_compass") REFERENCES "usuarios"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compass"."clientes_devolvidos" ADD CONSTRAINT "original_advisor_fk" FOREIGN KEY ("id_assessor_origem") REFERENCES "usuarios"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "escritorios"."filiais" ADD CONSTRAINT "fk_branch_city" FOREIGN KEY ("id_cidade") REFERENCES "localizacoes"."cidades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "escritorios"."filiais" ADD CONSTRAINT "fk_branch_leader" FOREIGN KEY ("id_responsavel") REFERENCES "usuarios"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "escritorios"."filiais_salas" ADD CONSTRAINT "fk_brach_rooms" FOREIGN KEY ("id_filial") REFERENCES "escritorios"."filiais"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "escritorios"."filiais_salas_reservadas" ADD CONSTRAINT "fk_booked_room" FOREIGN KEY ("id_sala") REFERENCES "escritorios"."filiais_salas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "escritorios"."filiais_salas_reservadas" ADD CONSTRAINT "fk_room_holder" FOREIGN KEY ("id_reservador") REFERENCES "usuarios"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "escritorios"."filiais_salas_reservadas" ADD CONSTRAINT "fk_room_user" FOREIGN KEY ("id_utilizador") REFERENCES "usuarios"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "escritorios"."times" ADD CONSTRAINT "times_id_filial_fkey" FOREIGN KEY ("id_filial") REFERENCES "escritorios"."filiais"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "escritorios"."times" ADD CONSTRAINT "times_id_lider_fkey" FOREIGN KEY ("id_lider") REFERENCES "usuarios"."usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "identidades"."credenciais" ADD CONSTRAINT "fk_users_credentials" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identidades"."grupos_funcoes" ADD CONSTRAINT "fk_groups_roles" FOREIGN KEY ("id_grupo") REFERENCES "identidades"."grupos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identidades"."tokens_usuarios" ADD CONSTRAINT "fk_tokens_usuarios" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identidades"."usuario_2fa" ADD CONSTRAINT "fk_users_2fa" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "localizacoes"."cidades" ADD CONSTRAINT "fk_cities_states" FOREIGN KEY ("id_estado") REFERENCES "localizacoes"."estados"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "localizacoes"."enderecos" ADD CONSTRAINT "fk_branch_address" FOREIGN KEY ("id_filial") REFERENCES "escritorios"."filiais"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "localizacoes"."enderecos" ADD CONSTRAINT "fk_city_address" FOREIGN KEY ("id_cidade") REFERENCES "localizacoes"."cidades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "localizacoes"."enderecos" ADD CONSTRAINT "fk_user_address" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketing"."convites" ADD CONSTRAINT "fk_event_guests_invitation" FOREIGN KEY ("id_eventos_convidados") REFERENCES "marketing"."eventos_convidados"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketing"."convites" ADD CONSTRAINT "fk_event_invitation" FOREIGN KEY ("id_evento") REFERENCES "marketing"."eventos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketing"."eventos" ADD CONSTRAINT "fk_mk_event" FOREIGN KEY ("id_tp_evento") REFERENCES "marketing"."tp_eventos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketing"."eventos" ADD CONSTRAINT "fk_mk_event_branch" FOREIGN KEY ("id_filial") REFERENCES "escritorios"."filiais"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketing"."eventos_convidados" ADD CONSTRAINT "fk_event_invited_status" FOREIGN KEY ("id_status") REFERENCES "marketing"."status_convidado"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketing"."eventos_convidados" ADD CONSTRAINT "fk_event_invited_type" FOREIGN KEY ("id_tp_convidado") REFERENCES "marketing"."tp_convidados"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketing"."eventos_convidados" ADD CONSTRAINT "fk_event_inviter" FOREIGN KEY ("id_convidador") REFERENCES "usuarios"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketing"."eventos_convidados" ADD CONSTRAINT "fk_invited_client" FOREIGN KEY ("id_cliente") REFERENCES "clientes"."clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketing"."eventos_convidados" ADD CONSTRAINT "fk_invited_event" FOREIGN KEY ("id_evento") REFERENCES "marketing"."eventos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketing"."eventos_convidados" ADD CONSTRAINT "fk_invited_prospect" FOREIGN KEY ("id_prospect") REFERENCES "clientes"."prospects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios"."codigos" ADD CONSTRAINT "fk_code_type" FOREIGN KEY ("id_tp_codigo") REFERENCES "usuarios"."tipos_codigos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios"."codigos" ADD CONSTRAINT "fk_user_code" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios"."usuarios_informacoes" ADD CONSTRAINT "fk_times" FOREIGN KEY ("id_time") REFERENCES "escritorios"."times"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios"."usuarios_informacoes" ADD CONSTRAINT "fk_user_branch" FOREIGN KEY ("id_filial") REFERENCES "escritorios"."filiais"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios"."usuarios_informacoes" ADD CONSTRAINT "fk_user_gender" FOREIGN KEY ("id_genero") REFERENCES "usuarios"."usuarios_generos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios"."usuarios_informacoes" ADD CONSTRAINT "fk_user_information" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios"."usuarios_informacoes" ADD CONSTRAINT "fk_user_marital_status" FOREIGN KEY ("id_estado_civil") REFERENCES "usuarios"."estado_civil"("id") ON DELETE CASCADE ON UPDATE CASCADE;
