import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthorizationGuard } from 'src/authorization/authorization.guard';
import { Collaborator } from 'src/authorization/collaborator.decorator';
import { CollaboratorsEntity } from 'src/collaborators/entities/collaborators.entity';
import { CompassService } from './compass.service';
import { CreateCompassSolicitationsDto } from './dto/create-compass-solicitations';
import { UpdateCompassDto } from './dto/update-compass.dto';

@Controller('compass')
@UseGuards(AuthorizationGuard)
export class CompassController {
  constructor(private readonly compassService: CompassService) {}

  @Post()
  create(
    @Collaborator() collaborator: CollaboratorsEntity,
    @Body() createCompassDto: CreateCompassSolicitationsDto,
  ) {
    return this.compassService.create(collaborator.sub, createCompassDto);
  }

  @Get()
  findAll() {
    return this.compassService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.compassService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompassDto: UpdateCompassDto) {
    return this.compassService.update(+id, updateCompassDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.compassService.remove(+id);
  }
}
