import { Decimal } from '@prisma/client/runtime';
import { Expose } from 'class-transformer';
import { CollaboratorsEntity } from 'src/collaborators/entities/collaborators.entity';

export class CompassClientsEntity {
  id: string;

  @Expose({ name: 'client' })
  cd_cliente: Decimal;

  @Expose({ name: 'is_available' })
  disponivel: boolean;

  @Expose({ name: 'is_aware' })
  cliente_ciente: boolean;

  @Expose({ name: 'returning' })
  em_devolucao: boolean;

  @Expose({ name: 'wealth' })
  patrimonio: number;

  @Expose({ name: 'advisor' })
  assessor_origem: CollaboratorsEntity;

  @Expose({ name: 'compass_advisor' })
  assessor_compass: CollaboratorsEntity;

  constructor(partial: Partial<CompassClientsEntity>) {
    Object.assign(this, partial);
  }
}
