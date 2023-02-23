import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { OfficesService } from './offices.service';
import { CreateOfficeDto } from './dto/create-office.dto';
import { UpdateOfficeDto } from './dto/update-office.dto';
import { AuthorizationGuard } from '../authorization/authorization.guard';
import { PermissionsGuard } from '../authorization/permissions.guard';
import { Permissions } from '../authorization/permissions.decorator';

@Controller('admin/offices')
@UseGuards(AuthorizationGuard, PermissionsGuard)
export class AdminOfficesController {
  constructor(private readonly officesService: OfficesService) {}

  @Get('/mea')
  @Permissions('read:offices')
  findAllMeA() {
    return this.officesService.findAllMeA();
  }

  @Get('/teams')
  @Permissions('read:offices')
  findAllTeams() {
    return this.officesService.findAllTeams();
  }
}
