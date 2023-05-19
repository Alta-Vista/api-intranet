import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'pg';

@Injectable()
export class RedshiftService implements OnModuleInit {
  private user: string;
  private host: string;
  private password: string;
  private database: string;

  private client: Client;

  constructor(private configService: ConfigService) {
    this.user = this.configService.get('REDSHIFT_USER');
    this.host = this.configService.get('REDSHIFT_HOST');
    this.password = this.configService.get('REDSHIFT_PASSWORD');
    this.database = this.configService.get('REDSHIFT_DB');

    this.client = new Client({
      user: this.user,
      host: this.host,
      password: this.password,
      database: this.database,
      port: 5432,
    });
  }

  async onModuleInit() {
    await this.client.connect();
  }

  async beforeApplicationShutdown() {
    await this.client.end();
  }

  async query(
    text: string,
    values: any[],
  ): Promise<{ data: any[]; total: number }> {
    const { rows, rowCount } = await this.client.query(text, values);

    const data = rows;
    const total = rowCount;

    return {
      total,
      data,
    };
  }
}
