import { PartialType } from '@nestjs/mapped-types';
import { CreateCollaboratorsDataDto } from './create-collaborators-data.dto';

export class UpdateCollaboratorsDataDto extends PartialType(
  CreateCollaboratorsDataDto,
) {}
