import { Exclude, Expose } from 'class-transformer';

enum RequestedClientsStatus {
  SOLICITADO = 'SOLICITADO',
  ERRO = 'ERRO',
  ATRIBUIDO = 'ATRIBUIDO',
}

export class RequestedClientsEntity {
  id: string;

  @Exclude()
  id_solicitacao: string;

  @Expose({ name: 'client' })
  cliente: number;

  @Expose({ name: 'advisor' })
  cod_assessor: string;

  @Expose({ name: 'status' })
  status: RequestedClientsStatus;

  @Expose({ name: 'message' })
  mensagem: string | null;

  @Expose({ name: 'requested_at' })
  dt_solicitacao: Date;

  @Expose({ name: 'updated_at' })
  dt_atualizacao: Date | null;

  constructor(partial: Partial<RequestedClientsEntity>) {
    Object.assign(this, partial);
  }
}
