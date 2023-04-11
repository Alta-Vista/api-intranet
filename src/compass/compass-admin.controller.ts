import {
  Controller,
  Body,
  UseGuards,
  Put,
  Get,
  UseInterceptors,
  Query,
  ClassSerializerInterceptor,
  Post,
} from '@nestjs/common';
import { AuthorizationGuard } from '../authorization/authorization.guard';
import { Permissions } from '../authorization/permissions.decorator';
import { PermissionsGuard } from '../authorization/permissions.guard';
import { ListCompassTransformerInterceptor } from './interceptors/list-compass-clients-transformer.interceptor';
import { CompassService } from './compass.service';
import { AssignCompassClientsDto } from './dto/assign-compass-clients.dto';
import { FindAllClientsDto } from './dto/find-all-clients.dto';
import {
  CompassAdvisorsTransformerInterceptor,
  ListCompassReassignedClientsTransformerInterceptor,
} from './interceptors';
import { Collaborator } from 'src/authorization/collaborator.decorator';
import { collaboratorAuthInterface } from 'src/collaborators/interfaces/collaborators-auth.interface';
import { ReassignCompassClientsDto } from './dto/reassign-compass-clients.dto';
import { ListReassignedClientsDto } from './dto/list-reassigned-compass-clients.dto';

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

  @Put('/clients/assign')
  @Permissions('edit:compass-clients')
  async update(@Body() { client, compass_advisor }: AssignCompassClientsDto) {
    return this.compassService.assignClientsToCompassAdvisor(
      client,
      compass_advisor,
    );
  }

  @Get('/advisors')
  @Permissions('read:compass-advisors')
  @UseInterceptors(CompassAdvisorsTransformerInterceptor)
  async listAdvisors() {
    return this.compassService.findCompassAdvisors();
  }

  @Post('/clients/reassign')
  @Permissions('edit:compass-clients')
  async reassignClients(
    @Body() assignClients: ReassignCompassClientsDto,
    @Collaborator() collaborator: collaboratorAuthInterface,
  ) {
    return this.compassService.reassignClients(collaborator.sub, assignClients);
  }

  @Get('/clients/reassign')
  @Permissions('read:compass-clients')
  @UseInterceptors(ListCompassReassignedClientsTransformerInterceptor)
  async lisReassignedClients(@Query() query: ListReassignedClientsDto) {
    return this.compassService.listReassignedClients({
      limit: query.limit || '10',
      offset: query.offset || '1',
    });
  }
}
