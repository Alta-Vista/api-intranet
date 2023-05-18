import { PartialType } from '@nestjs/mapped-types';
import { CreateInsuranceDto } from './create-insurance-client.dto';

export class UpdateInsuranceDto extends PartialType(CreateInsuranceDto) {}
