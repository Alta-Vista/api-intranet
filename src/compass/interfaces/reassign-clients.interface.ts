export interface ReassignClientsInterface {
  id_solicitacao: string;
  cliente: number;
  cod_a_destino?: string;
  status: 'SOLICITADO';
}
