import { ValidateNested } from 'class-validator';
import { CreateCollaboratorsAddressDto } from './create-collaborators-address.dto';
import { CreateCollaboratorMeA } from './create-collaborators-mea.dto';
import { CreateCollaboratorsProfileDto } from './create-collaborators-profile.dto';
import { CreateCollaboratorDto } from './create-collaborators.dto';
import { Type } from 'class-transformer';

export class CreateCollaboratorsDataDto {
  @ValidateNested({ each: true })
  @Type(() => CreateCollaboratorDto)
  collaborator: CreateCollaboratorDto;

  @ValidateNested()
  @Type(() => CreateCollaboratorsProfileDto)
  profile: CreateCollaboratorsProfileDto;

  @ValidateNested()
  @Type(() => CreateCollaboratorMeA)
  mea: CreateCollaboratorMeA | null;

  @ValidateNested()
  @Type(() => CreateCollaboratorsAddressDto)
  address: CreateCollaboratorsAddressDto;
}
