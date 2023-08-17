import { Injectable, HttpException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { myCapitalListenersConstants } from './constants';
import { CreateMyCapitalDto } from './dto';
import { MyCapitalRepository } from './repository/my-capital.repository';
import { ListMyCapitalRequestedClientsDto } from './dto/list-my-capital-requested-clients.dto';
import { ListMyCapitalClientsDto } from './dto/list-my-capital-clients.dto';

@Injectable()
export class MyCapitalService {
  constructor(
    private readonly myCapitalRepository: MyCapitalRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async create({ client, payer }: CreateMyCapitalDto, requester_id: string) {
    const request = await this.myCapitalRepository.createRequest(requester_id);

    const clientAlreadyExists =
      await this.myCapitalRepository.findMyCapitalClient(client);

    if (clientAlreadyExists) {
      await this.myCapitalRepository.createClientSolicitation({
        client: client,
        payer: payer,
        request_id: request.id,
        message: 'Cliente já foi enviado a MyCapital',
        status: 'ERRO',
        requester_id,
      });

      throw new HttpException('Client already exists', 409);
    }

    const createClientRequest =
      await this.myCapitalRepository.createClientSolicitation({
        client: client,
        payer: payer,
        request_id: request.id,
        requester_id,
        message: 'Cliente recebido!',
      });

    this.eventEmitter.emit(myCapitalListenersConstants.NEW_CLIENT_REQUESTED, {
      id: createClientRequest.id,
    });

    return createClientRequest;
  }

  async findAdvisorClients(data: ListMyCapitalClientsDto, advisor: string) {
    return this.myCapitalRepository.findAdvisorClients({
      limit: Number(data.limit),
      offset: Number(data.offset),
      advisor,
    });
  }

  async findAdvisorClient(client: number) {
    return this.myCapitalRepository.findMyCapitalClient(client);
  }

  async listRequestedClients(
    data: ListMyCapitalRequestedClientsDto,
    requester_id: string,
  ) {
    return this.myCapitalRepository.listAdvisorRequestedClients({
      limit: Number(data.limit),
      offset: Number(data.offset),
      requester_id,
    });
  }
}
