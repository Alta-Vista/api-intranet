import { Exclude, Expose } from 'class-transformer';
import { CollaboratorsInformationEntity } from './collaborators-information.entity';

export class CollaboratorsEntity {
  @Expose()
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

  colaboradores_informacoes: CollaboratorsInformationEntity;

  constructor(partial: Partial<CollaboratorsEntity>) {
    Object.assign(this, partial);
  }
}
