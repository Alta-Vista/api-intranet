import { PartialType } from '@nestjs/mapped-types';
import { CreateMyCapitalDto } from './create-my-capital.dto';

export class UpdateMyCapitalDto extends PartialType(CreateMyCapitalDto) {}
