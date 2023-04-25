import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { ManagementClient } from 'auth0';
import { CreateCollaboratorInAuthProviderDto } from '../dtos/create-collaborator-in-auth-provider.dto';
import { generate } from 'generate-password';

@Injectable()
export class CollaboratorCreatedListener {
  private auth0: ManagementClient;
  private AUTH0_DOMAIN: string;
  private AUTH0_CLIENT_ID: string;
  private AUTH0_CLIENT_SECRET: string;
  private AUTH0_CONNECTION: string;
  private APP_URL: string;
  private ENVIRONMENT: string;

  constructor(private configService: ConfigService) {
    this.AUTH0_CLIENT_ID = this.configService.get('AUTH0_CLIENT_ID');
    this.AUTH0_DOMAIN = this.configService.get('AUTH0_DOMAIN');
    this.AUTH0_CLIENT_SECRET = this.configService.get('AUTH0_CLIENT_SECRET');
    this.AUTH0_CONNECTION = this.configService.get('AUTH0_CONNECTION');
    this.APP_URL = this.configService.get('APP_URL');
    this.ENVIRONMENT = this.configService.get('ENVIRONMENT');

    this.auth0 = new ManagementClient({
      domain: this.AUTH0_DOMAIN,
      clientId: this.AUTH0_CLIENT_ID,
      clientSecret: this.AUTH0_CLIENT_SECRET,
    });
  }

  @OnEvent('collaborator.created')
  async createCollaboratorInAuthProvider({
    family_name,
    name,
    collaborator_id,
    internal_code,
    email,
    advisor_code,
    role,
  }: CreateCollaboratorInAuthProviderDto) {
    try {
      if (this.ENVIRONMENT === 'prod') {
        const password = generate({
          length: 10,
          numbers: true,
          symbols: true,
          lowercase: true,
          uppercase: true,
          strict: true,
        });

        await this.auth0.createUser({
          connection: this.AUTH0_CONNECTION,
          email,
          family_name,
          name,
          password,
          user_id: collaborator_id,
          user_metadata: {
            Assessor: advisor_code,
            funcao: role,
            codInterno: internal_code,
          },
        });
      } else {
        console.log('Colaborador criado!');
      }
    } catch (e) {
      console.log(e);

      if (e.statusCode === 409) {
        throw new ConflictException();
      }
    }
  }
}
