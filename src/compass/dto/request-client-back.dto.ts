import { IsNumber, IsString, MaxLength } from 'class-validator';

export class RequestClientBackDto {
  @IsNumber()
  client: number;

  @IsString()
  @MaxLength(255, {
    message: 'Reason is too long',
  })
  reason: string;
}
