import { CompassStatus } from './compass-status.interface';

export interface ReassignClientsInterface {
  id_solicitacao: string;
  cliente: number;
  cod_a_destino?: string;
  status: CompassStatus;
}
