import { Injectable } from '@nestjs/common';
import { MyCapitalRepository } from '../repository/my-capital.repository';

@Injectable()
export class MyCapitalAdminService {
  constructor(private myCapitalRepository: MyCapitalRepository) {}

  async listRequestedClients() {
    return this.myCapitalRepository.listAllRequestedClients();
  }
}
