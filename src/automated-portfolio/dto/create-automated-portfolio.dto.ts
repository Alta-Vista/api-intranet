import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AssetType } from '../interfaces';
import { Type } from 'class-transformer';

class CreateAutomatedPortfolioRequestType {
  @IsNumber()
  client: number;

  @IsString()
  advisor: string;

  @IsString()
  asset: string;

  @IsEnum(AssetType)
  type: AssetType;

  @IsNumber()
  quantity: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  amount: number;

  @IsBoolean()
  is_automated_portfolio: boolean;

  @IsNumber({ maxDecimalPlaces: 2 })
  solicited_amount: number;
}

export class CreateAutomatedPortfolioRequestDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAutomatedPortfolioRequestType)
  requests: CreateAutomatedPortfolioRequestType[];
}
