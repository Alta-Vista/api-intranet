import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { AssetStatus } from '../interfaces';
import { Type } from 'class-transformer';

class PortfolioAssets {
  @IsUUID()
  id: string;

  @IsEnum(AssetStatus)
  status: AssetStatus;

  @IsString()
  @ValidateIf((property) => property.status === 'ERRO')
  @IsNotEmpty({
    message: 'Mensagem é obrigatória',
  })
  message: string;
}

export class UpdateAutomatedPortfolioDto {
  @IsUUID()
  request_id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PortfolioAssets)
  assets: PortfolioAssets[];
}
