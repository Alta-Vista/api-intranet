import { Exclude, Expose } from 'class-transformer';

export class CollaboratorsEntity {
  id: string;

  @Expose({ name: 'name' })
  nome: string;

  @Expose({ name: 'surname' })
  sobrenome: string;

  @Expose({ name: 'email' })
  email: string;

  @Expose({ name: 'advisor_code' })
  cod_assessor: string;

  @Expose({ name: 'code' })
  cod_interno: number;

  @Exclude()
  dt_criacao: Date;

  constructor(partial: Partial<CollaboratorsEntity>) {
    Object.assign(this, partial);
  }
}
