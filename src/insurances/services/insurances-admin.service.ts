import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateInsuranceDto } from '../dto/create-insurance.dto';
import { InsuranceRepository } from '../insurances.repository';
import { ListInsuranceInsuranceDto } from '../dto/list-insurance-clients.dto';

@Injectable()
export class InsurancesAdminService {
  constructor(private readonly insurancesRepository: InsuranceRepository) {}

  async createClient({
    advisor_code,
    client_type,
    cpf,
    name,
    xp_code,
  }: CreateInsuranceDto) {
    let int_code: string;

    const clientAlreadyExists = await this.insurancesRepository.findClient({
      cpf,
      xp_code,
    });

    if (clientAlreadyExists) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: 'Client already registered',
        },
        HttpStatus.CONFLICT,
      );
    }

    if (client_type === 'EXTERNO') {
      const totalClients =
        await this.insurancesRepository.totalInsuranceClients();

      int_code = `sg|90${totalClients + 1}`;
    }

    const client = await this.insurancesRepository.createInsuranceClient({
      advisor_code,
      client_type,
      cpf,
      name,
      xp_code,
      int_code,
    });

    return {
      id: client.id,
      name: client.nome,
    };
  }

  async listClients({ limit, offset }: ListInsuranceInsuranceDto) {
    return this.insurancesRepository.listAllClients({
      limit: Number(limit),
      offset: Number(offset),
    });
  }
}
