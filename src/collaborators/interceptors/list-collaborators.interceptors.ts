import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CollaboratorsEntity } from '../entities/collaborators.entity';

interface InterceptDataType {
  limit: number;
  page: number;
  total: number;
  collaborators: CollaboratorsEntity[];
}

@Injectable()
export class ListCollaboratorsTransform<T> implements NestInterceptor<T> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: InterceptDataType) => {
        const parsedData = data.collaborators.map((collaborator) => {
          return {
            id: collaborator.id,
            name: collaborator.nome,
            surname: collaborator.sobrenome,
            email: collaborator.email,
            advisor_code: collaborator.cod_assessor || null,
            code: collaborator.cod_interno,
            av_entry_date:
              collaborator.colaboradores_informacoes.dt_entrada_av || null,
            branch: collaborator.colaboradores_informacoes.filial.nome || null,
          };
        });

        return {
          limit: Number(data.limit),
          page: Number(data.page),
          total: data.total,
          collaborators: parsedData,
        };
      }),
    );
  }
}
