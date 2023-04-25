import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { RequestedClientsEntity } from '../entities/requested-clients.entity';

interface InterceptDataType {
  total: number;
  limit: number;
  page: number;
  requests: RequestedClientsEntity[];
}

@Injectable()
export class ListRequestsTransformerInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: InterceptDataType) => {
        const parsedData = data.requests.map(
          (request) => new RequestedClientsEntity(request),
        );

        return {
          limit: Number(data.limit),
          page: Number(data.page),
          total: data.total,
          requests: parsedData,
        };
      }),
    );
  }
}
