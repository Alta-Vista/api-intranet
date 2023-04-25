import { Exclude, Expose } from 'class-transformer';
import { CollaboratorsEntity } from 'src/collaborators/entities/collaborators.entity';

export class CompassClientsEntity {
  id: string;

  @Expose({ name: 'client' })
  cliente: number;

  @Expose({ name: 'is_available' })
  disponivel: boolean;

  @Expose({ name: 'is_aware' })
  cliente_ciente: boolean;

  @Exclude()
  cod_a_origem: string;

  @Exclude()
  cod_a_compass: string;

  @Expose({ name: 'returning' })
  em_devolucao: boolean;

  @Expose({ name: 'wealth' })
  patrimonio_xp: number;

  @Expose({ name: 'created_at' })
  dt_criacao: Date;

  @Expose({ name: 'city' })
  cidade: string;

  @Expose({ name: 'state' })
  estado: string;

  @Expose({ name: 'client_solicitation_id' })
  id_solicitacoes_clientes: string;

  @Expose({ name: 'advisor' })
  assessor_origem: CollaboratorsEntity;

  @Expose({ name: 'compass_advisor' })
  assessor_compass: CollaboratorsEntity;

  constructor(partial: Partial<CompassClientsEntity>) {
    Object.assign(this, partial);
  }
}
