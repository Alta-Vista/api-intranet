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
import { Collaborator } from '../../authorization/collaborator.decorator';
import { collaboratorAuthInterface } from '../../auth-provider/interfaces/collaborators-auth.interface';

import {
  CompassAdvisorsTransformerInterceptor,
  GetCompassDataTransformerInterceptor,
  ListCompassReassignedClientsTransformerInterceptor,
  ListRequestedBackClientsTransformerInterceptor,
} from '../interceptors';

import {
  AssignCompassClientsDto,
  FindAllClientsDto,
  ListReassignedClientsDto,
  ListRequestBackClientsDto,
  ReassignCompassClientsDto,
  UpdateRequestBackClientsDto,
} from '../dto';

@Controller('admin/compass')
@UseGuards(AuthorizationGuard, PermissionsGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class CompassAdminController {
  constructor(private readonly compassService: CompassService) {}

  @Permissions({
    permissions: ['read:compass-clients'],
  })
  @Get('/clients')
  @UseInterceptors(ListCompassTransformerInterceptor)
  async listAllClients(@Query() query: FindAllClientsDto) {
    return this.compassService.listAllClients({
      limit: query.limit || '10',
      offset: query.offset || '1',
      is_available: query.is_available,
      advisor: query.advisor,
      compass_advisor: query.compass_advisor,
      client: query.client,
    });
  }

  @Put('/clients/assign')
  @Permissions({
    permissions: ['edit:compass-clients'],
  })
  async assignClient(
    @Body()
    data: AssignCompassClientsDto,
  ) {
    return this.compassService.assignClientsToCompassAdvisor(data);
  }

  @Get('/advisors')
  @Permissions({
    permissions: ['read:compass-advisors'],
  })
  @UseInterceptors(CompassAdvisorsTransformerInterceptor)
  async listAdvisors() {
    return this.compassService.findCompassAdvisors();
  }

  @Get('/data')
  @Permissions({
    permissions: ['read:compass-advisors'],
  })
  @UseInterceptors(GetCompassDataTransformerInterceptor)
  async getCompassData() {
    return this.compassService.getCompassData();
  }

  @Post('/clients/reassign')
  @Permissions({
    permissions: ['edit:compass-clients'],
  })
  async reassignClients(
    @Body() assignClients: ReassignCompassClientsDto,
    @Collaborator() collaborator: collaboratorAuthInterface,
  ) {
    return this.compassService.reassignClients(collaborator.sub, assignClients);
  }

  @Get('/clients/reassign')
  @Permissions({
    permissions: ['read:compass-clients'],
  })
  @UseInterceptors(ListCompassReassignedClientsTransformerInterceptor)
  async lisReassignedClients(@Query() query: ListReassignedClientsDto) {
    return this.compassService.listReassignedClients({
      limit: query.limit || '10',
      offset: query.offset || '1',
    });
  }

  @Get('/clients/client/request-back')
  @Permissions({
    permissions: ['read:compass-clients'],
  })
  @UseInterceptors(ListRequestedBackClientsTransformerInterceptor)
  listRequestBackClients(@Query() query: ListRequestBackClientsDto) {
    return this.compassService.listRequestedBackClients({
      limit: query.limit || '10',
      offset: query.offset || '1',
    });
  }

  @Put('/clients/client/request-back')
  @Permissions({
    permissions: ['edit:compass-clients'],
  })
  updateRequestBackClients(@Body() data: UpdateRequestBackClientsDto) {
    return this.compassService.updateRequestedBackClients(
      data.id,
      data.return_client,
      data.message,
    );
  }
}
