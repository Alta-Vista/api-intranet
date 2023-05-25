import { Expose } from 'class-transformer';

export class AssetsEntity {
  @Expose()
  id: string;

  @Expose({ name: 'client' })
  cliente: number;

  @Expose({ name: 'advisor' })
  cod_a: string;

  @Expose({ name: 'asset' })
  ativo: string;

  @Expose({ name: 'type' })
  tipo: string;

  @Expose({ name: 'quantity' })
  qtd_atual: number;

  @Expose({ name: 'amount' })
  valor_total_atual: number;

  @Expose({ name: 'is_automated' })
  carteira_adm: boolean;

  @Expose({ name: 'requested_at' })
  dt_solicitacao: boolean;

  @Expose({ name: 'total_requested' })
  total_solicitado: number;

  constructor(partial: Partial<AssetsEntity>) {
    Object.assign(this, partial);
  }
}
