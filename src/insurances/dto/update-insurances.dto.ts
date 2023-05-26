import { PartialType } from '@nestjs/mapped-types';
import { CreateInsuranceClientDto } from './create-insurances-client.dto';

export class UpdateInsuranceDto extends PartialType(CreateInsuranceClientDto) {}
