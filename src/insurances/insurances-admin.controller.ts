import { Controller, Post, Body } from '@nestjs/common';
import { InsurancesAdminService } from './insurances-admin.service';
import { CreateInsuranceDto } from './dto/create-insurance.dto';

@Controller('admin/insurances')
export class InsurancesAdminController {
  constructor(private readonly insurancesService: InsurancesAdminService) {}

  @Post('clients')
  createClient(@Body() createInsuranceDto: CreateInsuranceDto) {
    return this.insurancesService.createClient(createInsuranceDto);
  }
}
