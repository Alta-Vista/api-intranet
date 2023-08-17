import { Controller, Get, Post, Body, UseGuards, Param } from '@nestjs/common';
import { MyCapitalService } from './my-capital.service';
import { CreateMyCapitalDto } from './dto/create-my-capital.dto';
import { AuthorizationGuard } from '../authorization/authorization.guard';
import { CollaboratorAuthInterface } from '../auth-provider/interfaces/collaborators-auth.interface';
import { Collaborator } from '../authorization/collaborator.decorator';
import { ListMyCapitalRequestedClientsDto } from './dto/list-my-capital-requested-clients.dto';
import { ListMyCapitalClientsDto } from './dto/list-my-capital-clients.dto';

@Controller('my-capital')
@UseGuards(AuthorizationGuard)
export class MyCapitalController {
  constructor(private readonly myCapitalService: MyCapitalService) {}

  @Post()
  create(
    @Body() createMyCapitalDto: CreateMyCapitalDto,
    @Collaborator() collaborator: CollaboratorAuthInterface,
  ) {
    const [, collaborator_id] = collaborator.sub.split('|');

    return this.myCapitalService.create(createMyCapitalDto, collaborator_id);
  }

  @Get()
  findAll(
    @Collaborator() collaborator: CollaboratorAuthInterface,
    @Param() param: ListMyCapitalClientsDto,
  ) {
    const advisor = collaborator['http://user/metadata'].Assessor;

    return this.myCapitalService.findAdvisorClients(
      {
        limit: param.limit || '10',
        offset: param.offset || '1',
      },
      advisor,
    );
  }

  @Get()
  findAllRequestedClients(
    @Param() data: ListMyCapitalRequestedClientsDto,
    @Collaborator() collaborator: CollaboratorAuthInterface,
  ) {
    const [, collaborator_id] = collaborator.sub.split('|');

    return this.myCapitalService.listRequestedClients(
      {
        limit: data.limit || '10',
        offset: data.offset || '1',
        client: data.client,
        status: data.status,
      },
      collaborator_id,
    );
  }
}
