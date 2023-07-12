import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { InviteClientToEventInterface } from './interfaces/database';

@Injectable()
export class EventsRepository {
  constructor(private prisma: PrismaService) {}

  async inviteClient({
    client_id,
    event_id,
    guest_id,
    invited_type_id,
    prospect_id,
    status_id,
  }: InviteClientToEventInterface) {
    return this.prisma.eventos_convidados.create({
      data: {
        id_cliente: client_id,
        id_prospect: prospect_id,
        id_evento: event_id,
        id_tp_convidado: invited_type_id,
        id_status: status_id,
        id_convidador: guest_id,
      },
    });
  }

  async getEventInvitedStatus(status: string) {
    return this.prisma.status_convidado.findUnique({
      where: {
        status: status,
      },
    });
  }

  async getEventInvitedType(type: 'Cliente' | 'Prospect') {
    return this.prisma.tp_convidados.findFirst({
      where: {
        tipo_convidado: type,
      },
    });
  }

  async getEventById(id: string) {
    return this.prisma.eventos.findUnique({
      where: {
        id,
      },
    });
  }

  async findClientInEvent(client_id: string, event_id: string) {
    return this.prisma.eventos_convidados.findFirst({
      where: {
        id_cliente: client_id,
        id_evento: event_id,
      },
    });
  }

  async findClientByCode(code: number) {
    return this.prisma.clientes_clientes.findUnique({
      where: {
        codigo: code,
      },
    });
  }
}
