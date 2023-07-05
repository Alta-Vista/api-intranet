import { Exclude, Expose } from 'class-transformer';
import { AssetsEntity } from './assets.entity';
import { AutomatedPortfolioEntity } from './automated-portfolio.entity';

export class RequestsEntity {
  @Expose()
  id: string;

  @Expose({ name: 'client' })
  cliente: number;

  @Expose({ name: 'advisor' })
  cod_a: string;

  @Exclude()
  id_carteira: string;

  @Expose({ name: 'message' })
  mensagem: string;

  @Expose({ name: 'requested_at' })
  dt_criacao: Date;

  @Expose({ name: 'updated_at' })
  dt_atualizacao: Date;

  @Expose({ name: 'assets' })
  mesa_rv_cart_auto_soli_ativos: AssetsEntity[];

  @Expose({ name: 'portfolio' })
  carteiras: AutomatedPortfolioEntity;

  constructor(partial: Partial<RequestsEntity>) {
    Object.assign(this, partial);
  }
}
