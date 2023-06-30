import { Exclude, Expose } from 'class-transformer';

export class AssetsEntity {
  @Expose()
  id: string;

  @Expose({ name: 'asset' })
  ativo: string;

  @Expose({ name: 'type' })
  tipo: string;

  @Exclude()
  id_solicitacao: string;

  @Expose()
  status: string;

  @Expose({ name: 'quantity' })
  qtd_atual: number;

  @Expose({ name: 'amount' })
  valor_total_atual: number;

  @Expose({ name: 'total_requested' })
  total_solicitado: number;

  @Expose({ name: 'message' })
  mensagem: string;

  @Expose({ name: 'position_date' })
  dt_posicao: Date;

  constructor(partial: Partial<AssetsEntity>) {
    Object.assign(this, partial);
  }
}
