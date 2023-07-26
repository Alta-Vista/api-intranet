import { Injectable } from '@nestjs/common';
import { CloudFrontService } from 'src/aws/cloudfront/cloudfront.service';

@Injectable()
export class AwardsService {
  constructor(private cloudFrontService: CloudFrontService) {}

  getReport(advisor: string) {
    const url = this.cloudFrontService.createSignedUrls({
      bucketKey: `${advisor}.pdf`,
    });

    return {
      report_url: url,
    };
  }
}
