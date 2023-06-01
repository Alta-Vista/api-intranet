import { Expose } from 'class-transformer';

export class AutomatedPortfolioEntity {
  @Expose()
  id: string;

  @Expose({ name: 'name' })
  nome: string;

  @Expose({ name: 'min_application' })
  apli_min: number;

  @Expose({ name: 'is_active' })
  ativa: boolean;

  @Expose({ name: 'created_at' })
  dt_criacao: Date;

  @Expose({ name: 'updated_at' })
  dt_atualizacao: Date;

  constructor(partial: Partial<AutomatedPortfolioEntity>) {
    Object.assign(this, partial);
  }
}
