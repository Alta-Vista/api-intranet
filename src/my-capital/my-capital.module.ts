import { Module } from '@nestjs/common';
import { MyCapitalService } from './my-capital.service';
import { MyCapitalController } from './my-capital.controller';
import { DatabaseModule } from 'src/database/database.module';
import { MyCapitalRepository } from './repository/my-capital.repository';
import { MyCapitalListener } from './listeners/my-capital.listeners';

@Module({
  imports: [DatabaseModule],
  controllers: [MyCapitalController],
  providers: [MyCapitalService, MyCapitalRepository, MyCapitalListener],
})
export class MyCapitalModule {}
