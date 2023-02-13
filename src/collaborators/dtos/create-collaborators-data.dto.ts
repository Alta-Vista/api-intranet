import { CreateCollaboratorsAddressDto } from './create-collaborators-address.dto';
import { CreateCollaboratorMeA } from './create-collaborators-mea.dto';
import { CreateCollaboratorsProfileDto } from './create-collaborators-profile.dto';
import { CreateCollaboratorDto } from './create-collaborators.dto';

export class CreateCollaboratorsDataDto {
  collaborator: CreateCollaboratorDto;
  profile: CreateCollaboratorsProfileDto;
  mea: CreateCollaboratorMeA | null;
  address: CreateCollaboratorsAddressDto;
}
