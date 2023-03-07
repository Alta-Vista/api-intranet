export class CollaboratorsEntity {
  id: string;
  nome: string;

  constructor(partial: Partial<CollaboratorsEntity>) {
    Object.assign(this, partial);
  }
}
