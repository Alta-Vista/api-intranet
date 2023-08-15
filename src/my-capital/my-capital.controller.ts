import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { MyCapitalService } from './my-capital.service';
import { CreateMyCapitalDto } from './dto/create-my-capital.dto';
import { AuthorizationGuard } from 'src/authorization/authorization.guard';
import { collaboratorAuthInterface } from 'src/auth-provider/interfaces/collaborators-auth.interface';
import { Collaborator } from 'src/authorization/collaborator.decorator';

@Controller('my-capital')
@UseGuards(AuthorizationGuard)
export class MyCapitalController {
  constructor(private readonly myCapitalService: MyCapitalService) {}

  @Post()
  create(
    @Body() createMyCapitalDto: CreateMyCapitalDto,
    @Collaborator() collaborator: collaboratorAuthInterface,
  ) {
    const [, collaborator_id] = collaborator.sub.split('|');

    return this.myCapitalService.create(createMyCapitalDto, collaborator_id);
  }

  @Get()
  findAll(@Collaborator() collaborator: collaboratorAuthInterface) {
    const advisor = collaborator['http://user/metadata'].Assessor;

    return this.myCapitalService.findAdvisorClients(advisor);
  }
}
