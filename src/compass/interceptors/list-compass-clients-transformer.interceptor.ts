import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { CollaboratorsEntity } from 'src/collaborators/entities/collaborators.entity';
import { CompassClientsEntity } from '../entities/compass.entity';

interface InterceptDataType {
  total: number;
  wealth: number;
  limit: number;
  offset: number;
  clients: CompassClientsEntity[];
}

@Injectable()
export class ListCompassTransformerInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: InterceptDataType) => {
        const parsedData = data.clients.map(
          (client) =>
            new CompassClientsEntity({
              ...client,
              cliente: Number(client.cliente),
              patrimonio_xp: Number(client.patrimonio_xp),
              assessor_compass: new CollaboratorsEntity(
                client.assessor_compass,
              ),
              assessor_origem: new CollaboratorsEntity(client.assessor_origem),
            }),
        );

        return {
          wealth: data.wealth,
          limit: Number(data.limit),
          page: Number(data.offset),
          total: data.total,
          clients: parsedData,
        };
      }),
    );
  }
}
