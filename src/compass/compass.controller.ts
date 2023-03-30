import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { AuthorizationGuard } from 'src/authorization/authorization.guard';
import { Collaborator } from 'src/authorization/collaborator.decorator';
import { collaboratorAuthInterface } from 'src/collaborators/interfaces/collaborators-auth.interface';
import { CompassService } from './compass.service';
import { CreateCompassSolicitationsDto } from './dto/create-compass-solicitations';
import { ListRequestedClientsDto } from './dto/list-requested-clients.dto';

@Controller('compass')
@UseGuards(AuthorizationGuard)
export class CompassController {
  constructor(private readonly compassService: CompassService) {}

  @Post()
  create(
    @Collaborator() collaborator: collaboratorAuthInterface,
    @Body() createCompassDto: CreateCompassSolicitationsDto,
  ) {
    return this.compassService.create(collaborator.sub, createCompassDto);
  }

  @Get()
  findAll(
    @Collaborator() collaborator: collaboratorAuthInterface,
    @Query() query: ListRequestedClientsDto,
  ) {
    const [, collaboratorId] = collaborator.sub.split('|');

    return this.compassService.findAllRequestedClients(collaboratorId, {
      limit: query.limit || 10,
      offset: query.offset || 1,
    });
  }
}
