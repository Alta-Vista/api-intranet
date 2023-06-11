import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { AssetType } from '../interfaces';
import { Type } from 'class-transformer';

class CreateAutomatedPortfolioRequestType {
  @IsString()
  asset: string;

  @IsEnum(AssetType)
  type: AssetType;

  @IsNumber()
  quantity: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  amount: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  requested_amount: number;
}

export class CreateAutomatedPortfolioRequestDto {
  @IsNumber()
  client: number;

  @IsString()
  @IsOptional()
  advisor: string;

  @IsString()
  @IsOptional()
  message: string;

  @IsUUID()
  automated_portfolio_id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAutomatedPortfolioRequestType)
  assets: CreateAutomatedPortfolioRequestType[];
}
