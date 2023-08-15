import { HttpException, Injectable } from '@nestjs/common';
import { CreateMyCapitalDto } from './dto/create-my-capital.dto';
import { MyCapitalRepository } from './repository/my-capital.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { myCapitalListenersConstants } from './constants';

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
        error: 'Cliente já foi enviado a MyCapital',
        status: 'ERRO',
      });

      throw new HttpException('Client already exists', 409);
    }

    const createClientRequest =
      await this.myCapitalRepository.createClientSolicitation({
        client: client,
        payer: payer,
        request_id: request.id,
      });

    this.eventEmitter.emit(myCapitalListenersConstants.NEW_CLIENT_REQUESTED, {
      id: createClientRequest.id,
    });

    return createClientRequest;
  }

  async findAdvisorClients(advisor: string) {
    return this.myCapitalRepository.findAdvisorClients(advisor);
  }

  async findAdvisorClient(client: number) {
    return this.myCapitalRepository.findMyCapitalClient(client);
  }
}
