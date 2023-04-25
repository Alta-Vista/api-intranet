import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { OfficesService } from './offices.service';
import { UpdateOfficeDto } from './dto/update-office.dto';
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
