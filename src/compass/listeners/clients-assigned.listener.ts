import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { HubSpotService } from '../../hubspot/hubspot.service';
import { AssignCompassClientsDto } from '../dto';
import { CollaboratorsRepository } from '../../collaborators/collaborators.repository';
import { SQSService } from '../../aws/sqs/sqs.service';
import { SESService } from '../../aws/ses/ses.service';

@Injectable()
export class ClientsAssignedListener {
  constructor(
    private readonly hubSpotService: HubSpotService,
    private readonly collaboratorsRepository: CollaboratorsRepository,
    private readonly sqsService: SQSService,
    private readonly eventEmitter: EventEmitter2,
    private readonly sesService: SESService,
  ) {}

  async wait(milliseconds: number) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

  @OnEvent('compass.clients-assigned')
  async updateHubSpotContactOwner({
    clients,
    compass_advisor,
  }: AssignCompassClientsDto) {
    const result = clients.reduce((resultArray, item, index) => {
      const chunkIndex = Math.floor(index / 5);

      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = [];
      }

      resultArray[chunkIndex].push(item);

      return resultArray;
    }, []);

    const { email, nome } =
      await this.collaboratorsRepository.findCollaborators({
        advisor_code: compass_advisor,
      });

    const hsOwnerId = await this.hubSpotService.getOwnerIdByCollaboratorEmail(
      email,
    );

    for (let index = 0; index < result.length; index++) {
      const chunkContacts = result[index];

      const messageDeduplicationId = randomUUID();

      await this.sqsService.sendMessageToQueueHSUpdateContactOwner({
        deduplicationId: messageDeduplicationId,
        contacts: chunkContacts,
        ownerId: hsOwnerId.id,
      });

      await this.wait(1000);
    }

    const payload = {
      ownerId: hsOwnerId.id,
      clients,
    };

    await this.sesService.sendMessageCompassTemplate({
      name: nome,
      sendTo: email,
    });

    this.eventEmitter.emit('compass.create-advisor-task', payload);
  }
}
