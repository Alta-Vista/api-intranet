import { PartialType } from '@nestjs/mapped-types';
import { CreateCollaboratorsAddressDto } from './create-collaborators-address.dto';

export class UpdateCollaboratorsAddressDto extends PartialType(
  CreateCollaboratorsAddressDto,
) {}
