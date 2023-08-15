import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Knex, knex } from 'knex';

@Injectable()
export class KnexService {
  private user: string;
  private host: string;
  private password: string;
  private database: string;
  private port: string;

  private client: Knex;

  constructor(private configService: ConfigService) {
    this.user = this.configService.get('REDSHIFT_USER');
    this.host = this.configService.get('REDSHIFT_HOST');
    this.password = this.configService.get('REDSHIFT_PASSWORD');
    this.database = this.configService.get('REDSHIFT_DB');
    this.port = this.configService.get('REDSHIFT_PORT');

    this.client = knex({
      client: 'pg',
      connection: {
        user: this.user,
        database: this.database,
        host: this.host,
        password: this.password,
        port: Number(this.port),
      },
    });
  }

  queryKnex() {
    return this.client;
  }
}
