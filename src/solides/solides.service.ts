import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { SolidesCreateCollaboratorDto } from './dtos';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class SolidesService {
  private solidesBaseURL: string;
  private solidesToken: string;
  private solidesApi: AxiosInstance;
  private readonly logger = new Logger(SolidesService.name);

  constructor(
    private configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.solidesBaseURL = this.configService.get('SOLIDES_BASE_URL');
    this.solidesToken = this.configService.get('SOLIDES_TOKEN');
    this.solidesApi = axios.create({
      baseURL: this.solidesBaseURL,
      headers: {
        Authorization: `Token ${this.solidesToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
  }

  async getDepartments() {
    try {
      const { data } = await this.solidesApi({
        method: 'GET',
        url: 'departamentos',
      });

      return {
        departments: data,
      };
    } catch (error) {
      this.logger.error(error);
      console.log(error);

      const payload = {
        name: '',
        to: 'jin.oliveira@altavistainvest.com.br',
        message: `Erro ao listar departamentos,
        )}`,
        subject: '[ERRO SOLIDES] - Listar departamentos',
      };

      this.eventEmitter.emit('notification.send-notification', payload);
    }
  }

  async getPositions() {
    try {
      const { data } = await this.solidesApi({
        method: 'GET',
        url: 'cargos',
      });

      return {
        positions: data,
      };
    } catch (error) {
      this.logger.error(error);

      const payload = {
        name: '',
        to: 'jin.oliveira@altavistainvest.com.br',
        message: `Erro ao listar cargos`,
        subject: '[ERRO SOLIDES] - Listar Cargos',
      };

      this.eventEmitter.emit('notification.send-notification', payload);
    }
  }

  async createSolidesCollaborator(data: SolidesCreateCollaboratorDto) {
    try {
      await this.solidesApi.post('colaboradores', {
        name: data.name,
        email: data.email,
        idNumber: data.id_number,
        positionId: data.position_id,
        departamentId: data.department_id,
      });
    } catch (error) {
      this.logger.error(error);
      console.log(error);

      const payload = {
        name: '',
        to: 'jin.oliveira@altavistainvest.com.br',
        message: `Erro ao criar colaborador sólides, segue dados ${JSON.stringify(
          data,
        )}`,
        subject: '[ERRO SOLIDES] - Criar colaborador',
      };

      this.eventEmitter.emit('notification.send-notification', payload);
    }
  }
}
