import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { myCapitalListenersConstants } from '../constants';
import { MyCapitalRepository } from '../repository/my-capital.repository';
import { senMailConstant } from 'src/listeners/constants';

@Injectable()
export class MyCapitalListener {
  constructor(
    private myCapitalRepository: MyCapitalRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  @OnEvent(myCapitalListenersConstants.NEW_CLIENT_REQUESTED)
  async newClientRequested(payload: { id: string }) {
    const requestedClient = await this.myCapitalRepository.getClientRequestById(
      payload.id,
    );

    const getRedshiftClient = await this.myCapitalRepository.getRedshiftClient(
      requestedClient.cod_cliente,
    );

    if (!getRedshiftClient) {
      await this.myCapitalRepository.updateRequestedClient({
        id: requestedClient.id,
        error: 'Cliente não foi encontrado',
        status: 'ERRO',
      });

      return;
    }

    await this.myCapitalRepository.createMyCapitalClient({
      advisor: getRedshiftClient.advisor,
      client_code: requestedClient.cod_cliente,
      document_id: getRedshiftClient.document_id,
      email: getRedshiftClient.email,
      name: getRedshiftClient.name,
      payer: requestedClient.pagador,
      requested_client_id: payload.id,
    });

    const mailPayload = {
      name: '',
      to: 'vitor.ricardo@altavistainvest.com.br',
      message: `Um novo cliente foi solicitado para cadastro na My Capital, entre na Intranet e veja mais informações.`,
      subject: '[MESA RV] - My Capital',
    };

    this.eventEmitter.emit(senMailConstant.SEND_NOTIFICATION_MAIL, mailPayload);
  }
}
