/* eslint-disable prettier/prettier */
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ReassignedCompassClientsEntity } from '../entities/reassigned-compass-clients.entity';

interface InterceptDataType {
  total: number;
  limit: number;
  offset: number;
  requests: ReassignedCompassClientsEntity[];
}

export class ListCompassReassignedClientsTransformerInterceptor
  implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: InterceptDataType) => {
        const parsedData = data.requests.map(
          (request) => new ReassignedCompassClientsEntity(request),
        );

        return {
          limit: Number(data.limit),
          page: Number(data.offset),
          total: data.total,
          requests: parsedData,
        };
      }),
    );
  }
}
