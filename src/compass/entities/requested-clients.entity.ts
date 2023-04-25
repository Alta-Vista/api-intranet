import { Exclude, Expose } from 'class-transformer';
import { CompassStatus } from '../interfaces';

export class RequestedClientsEntity {
  id: string;

  @Exclude()
  id_solicitacao: string;

  @Expose({ name: 'client' })
  cliente: number;

  @Expose({ name: 'advisor' })
  cod_assessor: string;

  @Expose({ name: 'status' })
  status: CompassStatus;

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
