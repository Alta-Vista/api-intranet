import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CompassAdvisorService } from '../services';
import { FindAllClientsDto } from '../dto/find-all-clients.dto';
import { Collaborator } from 'src/authorization/collaborator.decorator';
import { collaboratorAuthInterface } from '../../auth-provider/interfaces/collaborators-auth.interface';
import {
  ListCompassTransformerInterceptor,
  ListRequestedBackClientsTransformerInterceptor,
} from '../interceptors';
import { AuthorizationGuard } from 'src/authorization/authorization.guard';
import { ListRequestBackClientsDto } from '../dto/list-requested-back-clients.dto';

@Controller('compass/advisors')
@UseGuards(AuthorizationGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class CompassAdvisorController {
  constructor(private readonly compassAdvisorService: CompassAdvisorService) {}

  @Get('/clients')
  @UseInterceptors(ListCompassTransformerInterceptor)
  async getClients(
    @Collaborator() collaborator: collaboratorAuthInterface,
    @Query() query: FindAllClientsDto,
  ) {
    const [, collaboratorId] = collaborator.sub.split('|');

    return this.compassAdvisorService.getClients(collaboratorId, {
      limit: query.limit || '10',
      offset: query.offset || '1',
      client: query.client,
    });
  }

  @Get('/clients/requested-back')
  @UseInterceptors(ListRequestedBackClientsTransformerInterceptor)
  listRequestBackClients(
    @Collaborator() collaborator: collaboratorAuthInterface,
    @Query() query: ListRequestBackClientsDto,
  ) {
    const [, collaboratorId] = collaborator.sub.split('|');
    return this.compassAdvisorService.listRequestedBackClients(
      {
        limit: query.limit || '10',
        offset: query.offset || '1',
        client: query.client,
      },
      collaboratorId,
    );
  }
}
