import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

type Response = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userId: number;
};

@Injectable()
export class HubSpotService {
  private hsToken: string;
  private environment: string;
  private hubSpotURL: AxiosInstance;

  constructor(private configService: ConfigService) {
    this.hsToken = this.configService.get('HS_ACCESS_TOKEN');
    this.environment = this.configService.get('ENVIRONMENT');
    this.hubSpotURL = axios.create({
      baseURL: 'https://api.hubapi.com/crm/v3',
      headers: {
        Authorization: `Bearer ${this.hsToken}`,
      },
    });
  }

  async getOwnerIdByCollaboratorEmail(email: string): Promise<Response> {
    if (this.environment === 'dev') {
      return {
        id: '123',
        email: 'string',
        firstName: 'string',
        lastName: 'string',
        userId: 123456,
      };
    }

    const { data } = await this.hubSpotURL({
      method: 'GET',
      url: `/owners/?limit=100&archived=false&email=${email}`,
    });

    return data.results[0];
  }
}
