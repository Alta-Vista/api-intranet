import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateCollaboratorDto {
  @IsOptional()
  id?: string;

  @IsString()
  name: string;

  @IsString()
  surname: string;

  @IsEmail()
  email: string;

  @IsString()
  advisor_code: string;
}
