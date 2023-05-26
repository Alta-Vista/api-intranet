import { Injectable } from '@nestjs/common';
import { ListInsuranceClientsDto } from '../dto';
import { InsuranceRepository } from '../insurances.repository';

@Injectable()
export class InsurancesAdvisorService {
  constructor(private readonly insuranceRepository: InsuranceRepository) {}

  listAdvisorClients({ limit, offset }: ListInsuranceClientsDto) {
    return 'hello';
  }
}
