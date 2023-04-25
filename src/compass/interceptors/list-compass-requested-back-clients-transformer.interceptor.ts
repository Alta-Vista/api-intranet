import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { RequestedBackClientsEntity } from '../entities/requested-back-clients.entity';

interface InterceptDataType {
  total: number;
  limit: number;
  offset: number;
  requests: RequestedBackClientsEntity[];
}

@Injectable()
export class ListRequestedBackClientsTransformerInterceptor
  implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: InterceptDataType) => {
        const parsedData = data.requests.map(
          (request) => new RequestedBackClientsEntity(request),
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
