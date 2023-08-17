import { Controller, Get, UseGuards } from '@nestjs/common';
import { AwardsService } from './awards.service';
import { CollaboratorAuthInterface } from 'src/auth-provider/interfaces/collaborators-auth.interface';
import { Collaborator } from 'src/authorization/collaborator.decorator';
import { AuthorizationGuard } from 'src/authorization/authorization.guard';

@Controller('awards')
@UseGuards(AuthorizationGuard)
export class AwardsController {
  constructor(private readonly awardsService: AwardsService) {}

  @Get('/report')
  getReport(@Collaborator() collaborator: CollaboratorAuthInterface) {
    console.log(collaborator);
    return this.awardsService.getReport(
      collaborator['http://user/metadata'].Assessor,
    );
  }
}
