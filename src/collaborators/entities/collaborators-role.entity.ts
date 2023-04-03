import { Expose } from 'class-transformer';

export class CollaboratorsRoleEntity {
  id: string;

  @Expose({ name: 'role' })
  funcao: string;
}
