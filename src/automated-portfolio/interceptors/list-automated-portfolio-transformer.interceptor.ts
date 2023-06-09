import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { AutomatedPortfolioEntity } from '../entities/automated-portfolio.entity';

@Injectable()
export class ListAutomatedPortfolioTransformerInterceptor
  implements NestInterceptor
{
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: AutomatedPortfolioEntity[]) => {
        const parsedData = data.map(
          (request) =>
            new AutomatedPortfolioEntity({
              ...request,
              apli_min: Number(request.apli_min),
            }),
        );

        return parsedData;
      }),
    );
  }
}
