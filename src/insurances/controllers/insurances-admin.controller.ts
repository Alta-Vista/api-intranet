import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import { InsurancesAdminService } from '../services/insurances-admin.service';
import { AuthorizationGuard } from '../../authorization/authorization.guard';
import { PermissionsGuard } from '../../authorization/permissions.guard';
import {
  CreateInsuranceClientDto,
  CreateInsuranceInsurerDto,
  CreateInsuranceInsurerProductDto,
  CreateInsurancePlansDto,
  CreateInsurancePlansStepDto,
  ListInsuranceInsuranceDto,
} from '../dto';
import { Permissions } from '../../authorization/permissions.decorator';

@Controller('admin/insurances')
@UseGuards(AuthorizationGuard, PermissionsGuard)
export class InsurancesAdminController {
  constructor(private readonly insurancesService: InsurancesAdminService) {}

  @Post('clients')
  @Permissions({
    permissions: ['create:insurance-clients'],
  })
  createClient(@Body() createInsuranceDto: CreateInsuranceClientDto) {
    return this.insurancesService.createClient(createInsuranceDto);
  }

  @Post('insurer')
  @Permissions({
    permissions: ['create:insurance-insurer'],
  })
  createInsurer(@Body() createInsurerDto: CreateInsuranceInsurerDto) {
    return this.insurancesService.createInsurer(createInsurerDto);
  }

  @Post('insurer/product')
  @Permissions({
    permissions: ['create:insurance-product'],
  })
  createInsurerProduct(
    @Body() createInsurerProductDto: CreateInsuranceInsurerProductDto,
  ) {
    return this.insurancesService.createInsurerProduct(createInsurerProductDto);
  }

  @Post('plans/step')
  @Permissions({
    permissions: ['create:insurance-step'],
  })
  createPlansStep(@Body() createPlansStep: CreateInsurancePlansStepDto) {
    return this.insurancesService.createPlansStep(createPlansStep);
  }

  @Post('plans')
  @Permissions({ permissions: ['create:insurance-plans'] })
  createInsurancePlan(
    @Body() createInsurancePlansDto: CreateInsurancePlansDto,
  ) {
    return this.insurancesService.createInsurancePlan(createInsurancePlansDto);
  }

  @Get('clients')
  @Permissions({ permissions: ['read:insurance-clients'] })
  listAllClients(@Query() query: ListInsuranceInsuranceDto) {
    return this.insurancesService.listClients({
      limit: query.limit || '10',
      offset: query.offset || '1',
      ...query,
    });
  }
}
