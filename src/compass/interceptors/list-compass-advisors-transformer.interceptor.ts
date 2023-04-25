import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

type Advisors = {
  id: string;
  nome: string;
  sobrenome: string;
  cod_interno: number;
  cod_assessor: number;
  total_pl: string;
  total_clientes: number;
};

@Injectable()
export class CompassAdvisorsTransformerInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: Advisors[]) => {
        const mappedAdvisors = data.map((advisor) => ({
          id: advisor.id,
          name: advisor.nome,
          surname: advisor.sobrenome,
          code: advisor.cod_interno,
          advisor_code: advisor.cod_assessor,
          total_wealth: Number(advisor.total_pl),
          total_clients: Number(advisor.total_clientes),
        }));

        return {
          advisors: mappedAdvisors,
        };
      }),
    );
  }
}
