import { Module } from '@nestjs/common';
import { CloudFrontModule } from 'src/aws/cloudfront/cloudfront.module';
import { AwardsController } from './awards.controller';
import { AwardsService } from './awards.service';

@Module({
  imports: [CloudFrontModule],
  controllers: [AwardsController],
  providers: [AwardsService],
})
export class AwardsModule {}
