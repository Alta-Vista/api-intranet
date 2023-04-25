import { CompassStatus } from '../interfaces';

export class CreateCompassClientesSolicitationsDto {
  id_solicitacao: string;
  cod_assessor: string;
  cliente: number;
  status: CompassStatus;
}
