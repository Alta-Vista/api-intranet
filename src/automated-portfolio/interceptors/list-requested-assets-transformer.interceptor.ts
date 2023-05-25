import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { AssetsEntity } from '../entities/assets.entity';

interface InterceptDataType {
  total: number;
  limit: number;
  page: number;
  assets: AssetsEntity[];
}

@Injectable()
export class ListRequestTransformerInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: InterceptDataType) => {
        const parsedData = data.assets.map(
          (request) =>
            new AssetsEntity({
              ...request,
              total_solicitado: Number(request.total_solicitado),
              valor_total_atual: Number(request.valor_total_atual),
            }),
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
