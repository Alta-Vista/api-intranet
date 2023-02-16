export class CreateCollaboratorInAuthProviderDto {
  collaborator_id: string;
  family_name: string;
  name: string;
  password: string;
  user_id: string;

  email: string;

  role: string;

  advisor_code: string;

  internal_code: number;
}
