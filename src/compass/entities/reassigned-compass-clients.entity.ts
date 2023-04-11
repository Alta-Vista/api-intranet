import { Exclude, Expose } from 'class-transformer';

enum RequestedClientsStatus {
  SOLICITADO = 'SOLICITADO',
  ERRO = 'ERRO',
  ATRIBUIDO = 'ATRIBUIDO',
}

export class ReassignedCompassClientsEntity {
  id: string;

  @Exclude()
  id_solicitacao: string;

  @Expose({ name: 'client' })
  cliente: number;

  @Expose({ name: 'advisor' })
  cod_a_origem: string | null;

  @Expose({ name: 'compass_advisor' })
  cod_a_compass: string | null;

  @Expose({ name: 'target_advisor' })
  cod_a_destino: string | null;

  @Expose({ name: 'status' })
  status: RequestedClientsStatus;

  @Expose({ name: 'message' })
  mensagem: string | null;

  @Expose({ name: 'requested_at' })
  dt_solicitacao: Date;

  @Expose({ name: 'updated_at' })
  dt_atualizacao: Date | null;

  constructor(partial: Partial<ReassignedCompassClientsEntity>) {
    Object.assign(this, partial);
  }
}
