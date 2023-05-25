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
import { AuthorizationGuard } from '../../authorization/authorization.guard';
import { Permissions } from '../../authorization/permissions.decorator';
import { PermissionsGuard } from '../../authorization/permissions.guard';
import { ListCompassTransformerInterceptor } from '../interceptors/list-compass-clients-transformer.interceptor';
import { CompassService } from '../services/compass.service';
import { AssignCompassClientsDto } from '../dto/assign-compass-clients.dto';
import { FindAllClientsDto } from '../dto/find-all-clients.dto';
import {
  CompassAdvisorsTransformerInterceptor,
  GetCompassDataTransformerInterceptor,
  ListCompassReassignedClientsTransformerInterceptor,
  ListRequestedBackClientsTransformerInterceptor,
} from '../interceptors';
import { Collaborator } from '../../authorization/collaborator.decorator';
import { collaboratorAuthInterface } from '../../auth-provider/interfaces/collaborators-auth.interface';
import { ReassignCompassClientsDto } from '../dto/reassign-compass-clients.dto';
import { ListReassignedClientsDto } from '../dto/list-reassigned-compass-clients.dto';
import { ListRequestBackClientsDto } from '../dto/list-requested-back-clients.dto';
import { UpdateRequestBackClientsDto } from '../dto/update-requested-back-clients.dto';

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
      is_available: query.is_available,
      advisor: query.advisor,
      compass_advisor: query.compass_advisor,
    });
  }

  @Put('/clients/client/assign')
  @Permissions('edit:compass-clients')
  async update(
    @Body()
    data: AssignCompassClientsDto,
  ) {
    return this.compassService.assignClientsToCompassAdvisor(data);
  }

  @Get('/advisors')
  @Permissions('read:compass-advisors')
  @UseInterceptors(CompassAdvisorsTransformerInterceptor)
  async listAdvisors() {
    return this.compassService.findCompassAdvisors();
  }

  @Get('/data')
  @Permissions('read:compass-advisors')
  @UseInterceptors(GetCompassDataTransformerInterceptor)
  async getCompassData() {
    return this.compassService.getCompassData();
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

  @Get('/clients/client/request-back')
  @Permissions('read:compass-clients')
  @UseInterceptors(ListRequestedBackClientsTransformerInterceptor)
  listRequestBackClients(@Query() query: ListRequestBackClientsDto) {
    return this.compassService.listRequestedBackClients({
      limit: query.limit || '10',
      offset: query.offset || '1',
    });
  }

  @Put('/clients/client/request-back')
  @Permissions('edit:compass-clients')
  updateRequestBackClients(@Body() data: UpdateRequestBackClientsDto) {
    return this.compassService.updateRequestedBackClients(
      data.id,
      data.return_client,
      data.message,
    );
  }
}
