import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { AuthorizationGuard } from '../../authorization/authorization.guard';
import { Collaborator } from '../../authorization/collaborator.decorator';
import { collaboratorAuthInterface } from '../../collaborators/interfaces/collaborators-auth.interface';
import { CompassService } from '../services/compass.service';
import { CreateCompassSolicitationsDto } from '../dto/create-compass-solicitations.dto';
import { FindAdvisorClientsDto } from '../dto/find-advisor-clients.dto';
import { ListRequestedClientsDto } from '../dto/list-requested-clients.dto';
import {
  ListCompassTransformerInterceptor,
  ListRequestedBackClientsTransformerInterceptor,
  ListRequestsTransformerInterceptor,
} from '../interceptors';
import { RequestClientBackDto } from '../dto/request-client-back.dto';
import { ListRequestBackClientsDto } from '../dto/list-requested-back-clients.dto';

@Controller('compass')
@UseGuards(AuthorizationGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class CompassController {
  constructor(private readonly compassService: CompassService) {}

  @Post('/clients')
  create(
    @Collaborator() collaborator: collaboratorAuthInterface,
    @Body() createCompassDto: CreateCompassSolicitationsDto,
  ) {
    return this.compassService.create(collaborator.sub, createCompassDto);
  }

  @Get('/requests')
  @UseInterceptors(ListRequestsTransformerInterceptor)
  findAllRequestedClients(
    @Collaborator() collaborator: collaboratorAuthInterface,
    @Query() query: ListRequestedClientsDto,
  ) {
    const [, collaboratorId] = collaborator.sub.split('|');

    return this.compassService.findAllRequestedClients(collaboratorId, {
      limit: query.limit || 10,
      offset: query.offset || 1,
    });
  }

  @Get('/clients')
  @UseInterceptors(ListCompassTransformerInterceptor)
  findAllAdvisorClients(
    @Collaborator() collaborator: collaboratorAuthInterface,
    @Query() query: FindAdvisorClientsDto,
  ) {
    const [, collaboratorId] = collaborator.sub.split('|');

    return this.compassService.findAllAdvisorClients(collaboratorId, {
      limit: query.limit || '10',
      offset: query.offset || '1',
      client: query.client,
    });
  }

  @Post('/clients/client/request-back')
  createRequestBackClients(
    @Collaborator() collaborator: collaboratorAuthInterface,
    @Body() data: RequestClientBackDto,
  ) {
    const [, collaboratorId] = collaborator.sub.split('|');
    return this.compassService.createRequestClientBack(collaboratorId, data);
  }

  @Get('/clients/client/request-back')
  @UseInterceptors(ListRequestedBackClientsTransformerInterceptor)
  listRequestBackClients(
    @Collaborator() collaborator: collaboratorAuthInterface,
    @Query() query: ListRequestBackClientsDto,
  ) {
    const [, collaboratorId] = collaborator.sub.split('|');
    return this.compassService.listRequestedBackClients(
      {
        limit: query.limit || '10',
        offset: query.offset || '1',
      },
      collaboratorId,
    );
  }
}
