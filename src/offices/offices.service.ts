import { Injectable } from '@nestjs/common';
import { OfficesRepository } from './offices.repository';

@Injectable()
export class OfficesService {
  constructor(private officesRepository: OfficesRepository) {}

  findAllOffices() {
    return this.officesRepository.listOffices();
  }

  findAllMeA() {
    return this.officesRepository.listMaA();
  }

  findAllTeams() {
    return this.officesRepository.listTeams();
  }
}
