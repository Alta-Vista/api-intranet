import { IsUUID } from 'class-validator';

export class ListRequestedAssetsDto {
  @IsUUID()
  request_id: string;
}
