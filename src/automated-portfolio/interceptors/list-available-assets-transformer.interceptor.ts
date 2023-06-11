import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

interface InterceptDataType {
  ativo: string;
  tipo: string;
  total_solicitado: number;
  solicitacoes: { cliente: number };
}

@Injectable()
export class ListAvailableAssetsTransformerInterceptor
  implements NestInterceptor
{
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: InterceptDataType[]) => {
        const parseData = data.map((d) => ({
          asset: d.ativo,
          type: d.tipo,
          total_amount: Number(d.total_solicitado),
          client: d.solicitacoes.cliente,
        }));

        return parseData;
      }),
    );
  }
}
