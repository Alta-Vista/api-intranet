import { IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateInsuranceInsurerProductDto {
  @IsString()
  product: string;

  @IsUUID()
  insurer_id: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  commission: number;
}
