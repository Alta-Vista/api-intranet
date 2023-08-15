import { Module } from '@nestjs/common';
import { MyCapitalService } from './my-capital.service';
import { MyCapitalController } from './my-capital.controller';
import { DatabaseModule } from 'src/database/database.module';
import { MyCapitalRepository } from './repository/my-capital.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [MyCapitalController],
  providers: [MyCapitalService, MyCapitalRepository],
})
export class MyCapitalModule {}
