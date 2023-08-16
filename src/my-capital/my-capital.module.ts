import { Module } from '@nestjs/common';
import { MyCapitalController } from './my-capital.controller';
import { DatabaseModule } from 'src/database/database.module';
import { MyCapitalRepository } from './repository/my-capital.repository';
import { MyCapitalListener } from './listeners/my-capital.listeners';
import { MyCapitalAdminService, MyCapitalService } from './services';

@Module({
  imports: [DatabaseModule],
  controllers: [MyCapitalController],
  providers: [
    MyCapitalService,
    MyCapitalAdminService,
    MyCapitalRepository,
    MyCapitalListener,
  ],
})
export class MyCapitalModule {}
