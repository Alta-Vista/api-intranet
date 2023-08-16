import { HttpException, Injectable } from '@nestjs/common';
import { MyCapitalRepository } from './repository/my-capital.repository';
import { UpdateMyCapitalRequestedClientDto } from './dto';
import { ListMyCapitalRequestedClientsDto } from './dto/list-my-capital-requested-clients.dto';

@Injectable()
export class MyCapitalAdminService {
  constructor(private myCapitalRepository: MyCapitalRepository) {}

  async listRequestedClients(data: ListMyCapitalRequestedClientsDto) {
    return this.myCapitalRepository.listAllRequestedClients(data);
  }

  async updateRequestedClient(data: UpdateMyCapitalRequestedClientDto) {
    if (data.status === 'ERRO' && !data.error_message)
      throw new HttpException('Error message is required', 400);

    const updateRequest = await this.myCapitalRepository.updateRequestedClient({
      id: data.request_id,
      status: data.status,
    });

    return updateRequest;
  }
}
