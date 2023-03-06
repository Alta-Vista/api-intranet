import {
  Body,
  Controller,
  Post,
  Put,
  UseGuards,
  Param,
  Get,
  Query,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { CollaboratorsService } from './collaborators.service';
import { CreateCollaboratorsDataDto } from './dtos/create-collaborators-data.dto';
import { AuthorizationGuard } from '../authorization/authorization.guard';
import { UpdateCollaboratorsDataDto } from './dtos/update-collaborators-data.dto';
import { UpdateCollaboratorsProfileDto } from './dtos/update-collaborators-profile.dto';
import { UpdateCollaboratorsAddressDto } from './dtos/update-collaborators-address.dto';
import { ListCollaboratorsDto } from './dtos/list-collaborators.dto';
import { Permissions } from '../authorization/permissions.decorator';
import { PermissionsGuard } from '../authorization/permissions.guard';

@Controller('admin/collaborators')
@UseGuards(AuthorizationGuard, PermissionsGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class CollaboratorsAdminController {
  constructor(private collaboratorsService: CollaboratorsService) {}

  @Get()
  @Permissions('read:users')
  listCollaborators(@Query() query: ListCollaboratorsDto) {
    return this.collaboratorsService.listCollaborators(
      query.limit || 10,
      query.offset || 1,
    );
  }

  @Get('roles')
  @Permissions('read:users')
  getRoles() {
    return this.collaboratorsService.listRoles();
  }

  @Get(':id')
  @Permissions('read:users')
  getCollaboratorProfile(@Param('id') id: string) {
    return this.collaboratorsService.getCollaboratorProfile(id);
  }

  @Post()
  @Permissions('create:users')
  createCollaborator(@Body() data: CreateCollaboratorsDataDto) {
    return this.collaboratorsService.createCollaborator(data);
  }

  @Put(':id')
  @Permissions('edit:users')
  updateCollaborator(
    @Param('id') id: string,
    @Body() data: UpdateCollaboratorsDataDto,
  ) {
    return this.collaboratorsService.updateCollaborator(id, data);
  }

  @Put('/profile/:id')
  @Permissions('edit:users')
  updateCollaboratorProfile(
    @Param('id') id: string,
    @Body() data: UpdateCollaboratorsProfileDto,
  ) {
    return this.collaboratorsService.updateCollaboratorProfile(id, data);
  }

  @Put('/address/:id')
  @Permissions('edit:users')
  updateCollaboratorAddress(
    @Param('id') id: string,
    @Body() data: UpdateCollaboratorsAddressDto,
  ) {
    return this.collaboratorsService.updateCollaboratorAddress(id, data);
  }
}
