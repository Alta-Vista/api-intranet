import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SolidesService } from './solides.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [SolidesService],
  exports: [SolidesService],
})
export class SolidesModule {}
