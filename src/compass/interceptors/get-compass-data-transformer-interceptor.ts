import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

interface InterceptorData {
  totalWealthAndClients: {
    _count: {
      cliente: number;
    };
    _sum: {
      patrimonio_xp: string;
    };
  };
  totalReturns: number;
  pendingClients: number;
  totalAdvisors: number;
}

@Injectable()
export class GetCompassDataTransformerInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: InterceptorData) => {
        return {
          total_clients: data.totalWealthAndClients._count.cliente,
          total_wealth: Number(data.totalWealthAndClients._sum.patrimonio_xp),
          total_returns: data.totalReturns,
          pending_clients: data.pendingClients,
          total_advisors: data.totalAdvisors,
        };
      }),
    );
  }
}
