import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthorizationGuard } from '../../authorization/authorization.guard';
import { ListInsuranceClientsDto, ListInsurancesPlansDto } from '../dto';
import { InsurancesBrokerService } from '../services/insurances-broker.service';
import { Collaborator } from '../../authorization/collaborator.decorator';
import { collaboratorAuthInterface } from '../../auth-provider/interfaces/collaborators-auth.interface';

@Controller('insurances/brokers')
@UseGuards(AuthorizationGuard)
export class InsurancesBrokerController {
  constructor(
    private readonly insurancesBrokerService: InsurancesBrokerService,
  ) {}

  @Get('clients')
  listClients(
    @Query() query: ListInsuranceClientsDto,
    @Collaborator() collaborator: collaboratorAuthInterface,
  ) {
    const [, broker] = collaborator.sub.split('|');

    return this.insurancesBrokerService.listBrokersClients(
      {
        limit: query.limit || '10',
        offset: query.offset || '1',
        ...query,
      },
      broker,
    );
  }

  @Get('clients/client/plans')
  listClientPlans(
    @Query() query: ListInsurancesPlansDto,
    @Collaborator() collaborator: collaboratorAuthInterface,
  ) {
    const [, broker] = collaborator.sub.split('|');

    return this.insurancesBrokerService.listBrokersClientsPlans(
      {
        limit: query.limit || '10',
        offset: query.offset || '1',
        ...query,
      },
      broker,
    );
  }
}
