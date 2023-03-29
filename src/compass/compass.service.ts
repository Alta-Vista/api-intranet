import { Injectable } from '@nestjs/common';
import { SQSService } from 'src/aws/sqs/sqs.service';
import { CompassRepository } from './compass.repository';
import { CreateCompassSolicitationsDto } from './dto/create-compass-solicitations';
import { UpdateCompassDto } from './dto/update-compass.dto';

enum CompassStatus {
  SOLICITADO = 'SOLICITADO',
}

@Injectable()
export class CompassService {
  constructor(
    private readonly compassRepository: CompassRepository,
    private readonly sqsService: SQSService,
  ) {}

  async create(requesterId: string, newClients: CreateCompassSolicitationsDto) {
    const [, collaboratorId] = requesterId.split('|');

    const request = await this.compassRepository.createSolicitation(
      collaboratorId,
    );

    const status = CompassStatus.SOLICITADO;

    const parsedNewClients = newClients.client.map((client) => {
      return {
        id_solicitacao: request.id,
        cod_assessor: newClients.advisor_code,
        cliente: Number(client),
        status,
      };
    });

    await this.compassRepository.createClientsSolicitation(parsedNewClients);

    await this.sqsService.sendMessage({
      message: request.id,
      deduplicationId: request.id,
      groupId: 'compass',
    });
  }

  findAll() {
    return `This action returns all compass`;
  }

  findOne(id: number) {
    return `This action returns a #${id} compass`;
  }

  update(id: number, updateCompassDto: UpdateCompassDto) {
    return `This action updates a #${id} compass`;
  }

  remove(id: number) {
    return `This action removes a #${id} compass`;
  }
}
