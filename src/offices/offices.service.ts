import { Injectable } from '@nestjs/common';
import { CreateOfficeDto } from './dto/create-office.dto';
import { UpdateOfficeDto } from './dto/update-office.dto';
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

  findOne(id: number) {
    return `This action returns a #${id} office`;
  }

  update(id: number, updateOfficeDto: UpdateOfficeDto) {
    return `This action updates a #${id} office`;
  }

  remove(id: number) {
    return `This action removes a #${id} office`;
  }
}
