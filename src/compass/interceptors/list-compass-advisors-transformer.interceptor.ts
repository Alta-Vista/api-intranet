import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { CollaboratorsEntity } from 'src/collaborators/entities/collaborators.entity';

@Injectable()
export class CompassAdvisorsTransformerInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: CollaboratorsEntity[]) => {
        const parsedData = data.map(
          (advisor) => new CollaboratorsEntity(advisor),
        );

        return {
          advisors: parsedData,
        };
      }),
    );
  }
}
