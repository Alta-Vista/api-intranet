import { Controller, Get, UseGuards } from '@nestjs/common';
import { OfficesService } from './offices.service';
import { AuthorizationGuard } from '../authorization/authorization.guard';

@Controller('offices')
@UseGuards(AuthorizationGuard)
export class OfficesController {
  constructor(private readonly officesService: OfficesService) {}

  @Get()
  findAll() {
    return this.officesService.findAllOffices();
  }
}
