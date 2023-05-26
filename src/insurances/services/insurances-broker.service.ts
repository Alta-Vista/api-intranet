import { Injectable } from '@nestjs/common';
import { InsuranceRepository } from '../insurances.repository';
import { ListInsuranceClientsDto, ListInsurancesPlansDto } from '../dto';

@Injectable()
export class InsurancesBrokerService {
  constructor(private readonly insurancesRepository: InsuranceRepository) {}

  async listBrokersClients(
    { limit, offset }: ListInsuranceClientsDto,
    broker_id: string,
  ) {
    return this.insurancesRepository.listBrokerClients({
      limit: Number(limit),
      offset: Number(offset),
      broker_id,
    });
  }

  async listBrokersClientsPlans({
    broker_id,
    limit,
    offset,
    client_id,
  }: ListInsurancesPlansDto) {
    return this.insurancesRepository.listClientsPlans({
      broker_id,
      client_id,
      limit: Number(limit),
      offset: Number(offset),
    });
  }
}
