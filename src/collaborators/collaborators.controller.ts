import { Body, Controller, Post } from '@nestjs/common';
import { CollaboratorsService } from './collaborators.service';
import { CreateCollaboratorsDataDto } from './dtos/create-collaborators-data.dto';

@Controller('collaborators')
export class CollaboratorsController {
  constructor(private collaboratorsService: CollaboratorsService) {}
  @Post()
  createCollaborator(@Body() data: CreateCollaboratorsDataDto) {
    return this.collaboratorsService.createCollaborator(data);
  }
}
