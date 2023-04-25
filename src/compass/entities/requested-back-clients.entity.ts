import { Exclude, Expose } from 'class-transformer';
import { CompassStatus } from '../interfaces';

class RequestedBackClientsEntity {
  id: string;

  @Exclude()
  id_solicitante: string;

  @Expose({ name: 'client' })
  cliente: number;

  @Expose({ name: 'advisor' })
  cod_a_origem: string;

  @Expose({ name: 'compass_advisor' })
  cod_a_compass: string;

  @Expose({ name: 'reason' })
  motivo: string;

  @Expose({ name: 'status' })
  status: CompassStatus;

  @Expose({ name: 'message' })
  mensagem: string | null;

  @Expose({ name: 'requested_at' })
  dt_solicitacao: Date;

  @Expose({ name: 'updated_at' })
  dt_atualizacao: Date | null;

  @Expose({ name: 'returned_at' })
  dt_devolucao: Date | null;

  constructor(partial: Partial<RequestedBackClientsEntity>) {
    Object.assign(this, partial);
  }
}

export { RequestedBackClientsEntity };
