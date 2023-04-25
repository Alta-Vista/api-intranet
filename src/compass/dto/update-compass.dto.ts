import { PartialType } from '@nestjs/mapped-types';
import { CreateCompassSolicitationsDto } from './create-compass-solicitations.dto';

export class UpdateCompassDto extends PartialType(
  CreateCompassSolicitationsDto,
) {}
