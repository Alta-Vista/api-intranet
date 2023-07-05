import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SQSService } from 'src/aws/sqs/sqs.service';
import * as dayjs from 'dayjs';

type Clients = {
  code: number;
  advisor: string;
  text: string;
  subject: string;
};

interface CreateOwnerTaskInterface {
  ownerId: string;
  clients: Clients[];
}

@Injectable()
export class CreateOwnerTaskListener {
  constructor(private readonly sqsService: SQSService) {}

  async wait(milliseconds: number) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

  @OnEvent('compass.create-advisor-task')
  async hubSpotCreateOwnerTask({ ownerId, clients }: CreateOwnerTaskInterface) {
    // Inserir data de vencimento da tarefa
    const expiresAtStringDate = dayjs().add(2, 'days').format();

    // Inserir texto e títulos personalizados para as tarefas para cada cliente
    const advisorsTask = clients.map((client) => ({
      contactXpCode: client.code,
      subject: `Entrar em contato cliente: ${client.code}`,
      text: `Novo cliente atribuído, não esqueça de entrar em contato com ele. Código: ${client.code} - Assessor origem: ${client.advisor}`,
    }));

    // Separar os contatos em 'chunks' para que cada função lambda faça até 5 chamadas API e 1 segundo
    const tasks = advisorsTask.reduce((resultArray, item, index) => {
      const chunkIndex = Math.floor(index / 5);

      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = [];
      }

      resultArray[chunkIndex].push(item);

      return resultArray;
    }, []) as Array<Clients[]>;

    // Fazer envios dos chunks para a fila do SQS e serem executados pelo lambda
    for (let index = 0; index < tasks.length; index++) {
      const chunkTasks = tasks[index];

      const messageDeduplicationId = randomUUID();

      await this.sqsService.sendMessageToQueueHubSpotCreateOwnerTask({
        ownerId,
        expiresAt: new Date(expiresAtStringDate),
        tasks: chunkTasks,
        deduplicationId: messageDeduplicationId,
      });

      // Esperar um segundo antes de partir para o próximo
      await this.wait(1000);
    }
  }
}
