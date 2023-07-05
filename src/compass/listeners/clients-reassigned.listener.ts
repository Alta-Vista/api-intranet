import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { HubSpotService } from '../../hubspot/hubspot.service';
import { AssignCompassClientsDto } from '../dto';
import { CollaboratorsRepository } from '../../collaborators/collaborators.repository';
import { SQSService } from '../../aws/sqs/sqs.service';
import { SESService } from '../../aws/ses/ses.service';
import { CompassRepository } from '../compass.repository';
import { CompassStatus } from '../interfaces';

@Injectable()
export class ClientsReassignedListener {
  constructor(
    private readonly hubSpotService: HubSpotService,
    private readonly collaboratorsRepository: CollaboratorsRepository,
    private readonly sqsService: SQSService,
    private readonly eventEmitter: EventEmitter2,
    private readonly sesService: SESService,
    private readonly compassRepository: CompassRepository,
  ) {}

  async wait(milliseconds: number) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

  @OnEvent('compass.clients-reassigned')
  async updateReassignmentsRequest(requestId: string) {
    const reassignments =
      await this.compassRepository.findReassignedClientsByRequestId(requestId);

    for await (const reassignment of reassignments) {
      const client = await this.compassRepository.findCompassClient(
        reassignment.cliente,
      );

      if (!client) {
        await this.compassRepository.updateReassignedClients({
          message: 'Cliente não foi encontrado!',
          status: CompassStatus.ERRO,
          id: reassignment.id,
        });

        continue;
      }

      const compassAdvisor =
        await this.compassRepository.findCompassAdvisorByAdvisorCode(
          reassignment.cod_a_destino,
        );

      if (!compassAdvisor) {
        await this.compassRepository.updateReassignedClients({
          message: 'Assessor de destino não foi encontrado!',
          status: CompassStatus.ERRO,
          id: reassignment.id,
        });

        continue;
      }

      await this.compassRepository.updateReassignedClients({
        message: 'Cliente reatribuído com sucesso!',
        status: CompassStatus.ATRIBUIDO,
        id: reassignment.id,
        advisor: client.cod_a_origem,
        currentCompassAdvisor: client.cod_a_compass,
      });

      await this.compassRepository.updateCompassClient({
        advisor_compass: reassignment.cod_a_destino,
        client: client.cliente,
      });
    }

    this.eventEmitter.emit('compass.get-reassignments-advisors', requestId);
  }

  @OnEvent('compass.get-reassignments-advisors')
  async getReassignmentsAdvisorAndClients(requestId: string) {
    const advisors = await this.compassRepository.getReassignmentsTargetAdvisor(
      requestId,
    );

    for await (const advisor of advisors) {
      const clients =
        await this.compassRepository.getReassignmentsTargetAdvisorClients(
          requestId,
          advisor.cod_a_destino,
        );

      this.eventEmitter.emit('compass.clients-assigned', {
        compass_advisor: advisor.cod_a_destino,
        clients,
      });
    }
  }
}
