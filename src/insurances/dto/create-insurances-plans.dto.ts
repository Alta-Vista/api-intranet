import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { InsurancePlansFrequency } from '../interfaces';

export class CreateInsurancePlansDto {
  @IsUUID()
  client_id: string;

  @IsUUID()
  consultant_id: string;

  @IsString()
  advisor: string;

  @IsUUID()
  insurer_id: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  pi: number;

  @IsEnum(InsurancePlansFrequency)
  @IsOptional()
  frequency: InsurancePlansFrequency;

  @IsOptional()
  product_id: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  pa: number;

  @IsBoolean()
  from_allocation: boolean;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  commission_percentage: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  total_commission: number;

  @IsUUID()
  step_id: string;

  @IsDateString()
  @IsOptional()
  recommended_at: Date;

  @IsDateString()
  @IsOptional()
  implemented_at: Date;

  @IsDateString()
  @IsOptional()
  paid_at: Date;

  @IsDateString()
  @IsOptional()
  updated_at: Date;
}
