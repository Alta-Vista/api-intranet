import { Module } from '@nestjs/common';
import { MyCapitalService } from './my-capital.service';
import { MyCapitalController } from './my-capital.controller';

@Module({
  controllers: [MyCapitalController],
  providers: [MyCapitalService],
})
export class MyCapitalModule {}
