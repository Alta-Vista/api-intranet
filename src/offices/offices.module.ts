import { Module } from '@nestjs/common';
import { OfficesService } from './offices.service';
import { OfficesController } from './offices.controller';
import { DatabaseModule } from 'src/database/database.module';
import { OfficesRepository } from './offices.repository';
import { ConfigModule } from '@nestjs/config';
import { AdminOfficesController } from './offices-admin.controller';

@Module({
  imports: [DatabaseModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [OfficesController, AdminOfficesController],
  providers: [OfficesService, OfficesRepository],
})
export class OfficesModule {}
