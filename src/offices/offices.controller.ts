import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { OfficesService } from './offices.service';
import { UpdateOfficeDto } from './dto/update-office.dto';
import { AuthorizationGuard } from '../authorization/authorization.guard';

@Controller('offices')
@UseGuards(AuthorizationGuard)
export class OfficesController {
  constructor(private readonly officesService: OfficesService) {}

  @Get()
  findAll() {
    return this.officesService.findAllOffices();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.officesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOfficeDto: UpdateOfficeDto) {
    return this.officesService.update(+id, updateOfficeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.officesService.remove(+id);
  }
}
