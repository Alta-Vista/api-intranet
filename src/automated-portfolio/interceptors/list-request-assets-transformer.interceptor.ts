import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { RequestsEntity } from '../entities/requests.entity';
import { AssetsEntity } from '../entities/assets.entity';
import { AutomatedPortfolioEntity } from '../entities/automated-portfolio.entity';

@Injectable()
export class ListRequestAssetsTransformerInterceptor
  implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: RequestsEntity) => {
        const assets = data.mesa_rv_cart_auto_soli_ativos.map(
          (asset) =>
            new AssetsEntity({
              ...asset,
              total_solicitado: Number(asset.total_solicitado),
              valor_total_atual: Number(asset.valor_total_atual),
            }),
        );

        const parsedData = new RequestsEntity({
          ...data,
          mesa_rv_cart_auto_soli_ativos: assets,
          carteiras: new AutomatedPortfolioEntity({
            ...data.carteiras,
            apli_min: Number(data.carteiras.apli_min),
          }),
        });

        return parsedData;
      }),
    );
  }
}
