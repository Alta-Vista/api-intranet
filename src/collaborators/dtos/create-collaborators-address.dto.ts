import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCollaboratorsAddressDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsString()
  zip_code: string;

  @IsString()
  street: string;

  @IsOptional()
  @IsString()
  complement: string;

  @IsString()
  neighborhood: string;

  @IsString()
  fu: string;

  @IsString()
  location: string;

  @IsString()
  number: number;

  @IsOptional()
  @IsString()
  collaborator_id?: string;
}
