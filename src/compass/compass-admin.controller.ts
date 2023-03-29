import { Controller, Body, UseGuards, Put } from '@nestjs/common';
import { AuthorizationGuard } from '../authorization/authorization.guard';
import { Permissions } from '../authorization/permissions.decorator';
import { PermissionsGuard } from '../authorization/permissions.guard';
import { CompassService } from './compass.service';
import { AssignCompassClientsDto } from './dto/assign-compass-clients.dto';

@Controller('admin/compass')
@UseGuards(AuthorizationGuard, PermissionsGuard)
export class CompassAdminController {
  constructor(private readonly compassService: CompassService) {}

  @Put('/assign')
  @Permissions('edit:compass-clients')
  update(@Body() { client, compass_advisor }: AssignCompassClientsDto) {
    return this.compassService.assignClientsToCompassAdvisor(
      client,
      compass_advisor,
    );
  }
}
