import { PartialType } from '@nestjs/mapped-types';
import { CreateCollaboratorsProfileDto } from './create-collaborators-profile.dto';

export class UpdateCollaboratorsProfileDto extends PartialType(
  CreateCollaboratorsProfileDto,
) {}
