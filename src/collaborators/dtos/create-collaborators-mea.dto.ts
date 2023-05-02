import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCollaboratorMeA {
  @IsOptional()
  @IsBoolean()
  mea?: boolean;

  @IsOptional()
  @IsUUID()
  collaborator_id?: string;

  @IsOptional()
  @IsUUID()
  mea_id?: string;

  @IsOptional()
  @IsString()
  rented_advisor_code?: string;
}
