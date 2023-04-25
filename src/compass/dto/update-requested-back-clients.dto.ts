import { IsBoolean, IsUUID, MaxLength, ValidateIf } from 'class-validator';

export class UpdateRequestBackClientsDto {
  @IsUUID()
  id: string;

  @ValidateIf((properties) => properties.return_client === false)
  @MaxLength(255, {
    message: 'Message is too long',
  })
  message: string;

  @IsBoolean()
  return_client: boolean;
}
