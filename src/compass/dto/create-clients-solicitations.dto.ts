import { CompassStatus } from '../interfaces';

export class CreateCompassClientsSolicitationsDto {
  id_solicitacao: string;
  cod_assessor: string;
  cliente: number;
  status: CompassStatus;
}
