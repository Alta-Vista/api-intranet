import {
  Controller,
  Body,
  UseGuards,
  Put,
  Get,
  UseInterceptors,
  Query,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { AuthorizationGuard } from '../authorization/authorization.guard';
import { Permissions } from '../authorization/permissions.decorator';
import { PermissionsGuard } from '../authorization/permissions.guard';
import { ListCompassTransformerInterceptor } from './interceptors/list-compass-clients-transformer.interceptor';
import { CompassService } from './compass.service';
import { AssignCompassClientsDto } from './dto/assign-compass-clients.dto';
import { FindAllClientsDto } from './dto/find-all-clients.dto';
import { CompassAdvisorsTransformerInterceptor } from './interceptors/list-compass-advisors-transformer.interceptor';

@Controller('admin/compass')
@UseGuards(AuthorizationGuard, PermissionsGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class CompassAdminController {
  constructor(private readonly compassService: CompassService) {}

  @Permissions('read:compass-clients')
  @Get('/clients')
  @UseInterceptors(ListCompassTransformerInterceptor)
  async listAllClients(@Query() query: FindAllClientsDto) {
    return this.compassService.findAllClients({
      limit: query.limit || '10',
      offset: query.offset || '1',
      isAvailable: query.isAvailable,
      advisor: query.advisor,
      compass_advisor: query.compass_advisor,
    });
  }

  @Put('/assign')
  @Permissions('edit:compass-clients')
  async update(@Body() { client, compass_advisor }: AssignCompassClientsDto) {
    await this.compassService.assignClientsToCompassAdvisor(
      client,
      compass_advisor,
    );

    return;
  }

  @Get('/advisors')
  @Permissions('read:compass-advisors')
  @UseInterceptors(CompassAdvisorsTransformerInterceptor)
  async listAdvisors() {
    return this.compassService.findCompassAdvisors();
  }
}
