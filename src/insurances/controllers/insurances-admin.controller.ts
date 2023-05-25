import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import { InsurancesAdminService } from '../services/insurances-admin.service';
import { CreateInsuranceClientDto } from '../dto/create-insurance-client.dto';
import { CreateInsuranceInsurerDto } from '../dto/create-insurance-insurer.dto';
import { CreateInsuranceInsurerProductDto } from '../dto/create-insurance-insurer-product.dto';
import { CreateInsurancePlansDto } from '../dto/create-insurance-plans.dto';
import { ListInsuranceInsuranceDto } from '../dto/list-insurance-clients.dto';
import { AuthorizationGuard } from '../../authorization/authorization.guard';
import { PermissionsGuard } from '../../authorization/permissions.guard';

@Controller('admin/insurances')
@UseGuards(AuthorizationGuard, PermissionsGuard)
export class InsurancesAdminController {
  constructor(private readonly insurancesService: InsurancesAdminService) {}

  @Post('clients')
  createClient(@Body() createInsuranceDto: CreateInsuranceClientDto) {
    return this.insurancesService.createClient(createInsuranceDto);
  }

  @Post('insurer')
  createInsurer(@Body() createInsurerDto: CreateInsuranceInsurerDto) {
    return this.insurancesService.createInsurer(createInsurerDto);
  }

  @Post('insurer')
  createInsurerProduct(
    @Body() createInsurerProductDto: CreateInsuranceInsurerProductDto,
  ) {
    return this.insurancesService.createInsurerProduct(createInsurerProductDto);
  }

  @Post('plans/step')
  createPlansStep(@Body() step: string) {
    return this.insurancesService.createPlansStep(step);
  }

  @Post('plans/step')
  createInsurancePlan(
    @Body() createInsurancePlansDto: CreateInsurancePlansDto,
  ) {
    return this.insurancesService.createInsurancePlan(createInsurancePlansDto);
  }

  @Get('clients')
  listAllClients(@Query() query: ListInsuranceInsuranceDto) {
    return this.insurancesService.listClients({
      limit: query.limit || '10',
      offset: query.offset || '1',
      ...query,
    });
  }
}
