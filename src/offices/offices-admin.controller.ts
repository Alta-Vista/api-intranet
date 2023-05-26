import { Controller, Get, UseGuards } from '@nestjs/common';
import { OfficesService } from './offices.service';
import { AuthorizationGuard } from '../authorization/authorization.guard';
import { PermissionsGuard } from '../authorization/permissions.guard';
import { Permissions } from '../authorization/permissions.decorator';

@Controller('admin/offices')
@UseGuards(AuthorizationGuard, PermissionsGuard)
export class AdminOfficesController {
  constructor(private readonly officesService: OfficesService) {}

  @Get('/mea')
  @Permissions({
    permissions: ['read:offices'],
  })
  findAllMeA() {
    return this.officesService.findAllMeA();
  }

  @Get('/teams')
  @Permissions({
    permissions: ['read:offices'],
  })
  findAllTeams() {
    return this.officesService.findAllTeams();
  }
}
