import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateInsuranceClientDto } from '../dto/create-insurance-client.dto';
import { InsuranceRepository } from '../insurances.repository';
import { ListInsuranceInsuranceDto } from '../dto/list-insurance-clients.dto';
import { CreateInsuranceInsurerDto } from '../dto/create-insurance-insurer.dto';
import { CreateInsuranceInsurerProductDto } from '../dto/create-insurance-insurer-product.dto';
import { CreateInsurancePlansDto } from '../dto/create-insurance-plans.dto';

@Injectable()
export class InsurancesAdminService {
  constructor(private readonly insurancesRepository: InsuranceRepository) {}

  async createClient({
    advisor_code,
    client_type,
    cpf,
    name,
    xp_code,
  }: CreateInsuranceClientDto) {
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

  async createInsurer({ insurer }: CreateInsuranceInsurerDto) {
    const insurerAlreadyExists = await this.insurancesRepository.findInsurer(
      insurer,
    );

    if (insurerAlreadyExists) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: 'Insurer already registered',
        },
        HttpStatus.CONFLICT,
      );
    }

    return this.insurancesRepository.createInsurer(insurer);
  }

  async createInsurerProduct({
    insurer_id,
    product,
    commission,
  }: CreateInsuranceInsurerProductDto) {
    const insurerProductAlreadyExists =
      await this.insurancesRepository.findInsurerProduct(product, insurer_id);

    if (insurerProductAlreadyExists) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: 'Insurer product already registered',
        },
        HttpStatus.CONFLICT,
      );
    }

    return this.insurancesRepository.createInsurerProduct({
      commission,
      insurer_id,
      product,
    });
  }

  async createPlansStep(step: string) {
    const stepAlreadyExists = await this.insurancesRepository.findPlansStep(
      step,
    );

    if (stepAlreadyExists) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: 'Plan step already registered',
        },
        HttpStatus.CONFLICT,
      );
    }

    return this.insurancesRepository.createPlansStep(step);
  }

  async createInsurancePlan(data: CreateInsurancePlansDto) {
    return this.insurancesRepository.createInsurancePlan(data);
  }

  async listClients({ limit, offset }: ListInsuranceInsuranceDto) {
    return this.insurancesRepository.listAllClients({
      limit: Number(limit),
      offset: Number(offset),
    });
  }
}
