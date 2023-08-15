import { HttpException, Injectable } from '@nestjs/common';
import { CreateMyCapitalDto } from './dto/create-my-capital.dto';
import { MyCapitalRepository } from './repository/my-capital.repository';

@Injectable()
export class MyCapitalService {
  constructor(private readonly myCapitalRepository: MyCapitalRepository) {}

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

    const createClientSolicitation =
      await this.myCapitalRepository.createClientSolicitation({
        client: client,
        payer: payer,
        request_id: request.id,
      });

    return createClientSolicitation;
  }

  async findAdvisorClients(advisor: string) {
    return this.myCapitalRepository.findAdvisorClients(advisor);
  }

  async findAdvisorClient(client: number) {
    return this.myCapitalRepository.findMyCapitalClient(client);
  }
}
