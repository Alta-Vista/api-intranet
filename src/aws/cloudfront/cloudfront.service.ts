import { getSignedUrl } from '@aws-sdk/cloudfront-signer';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as dayjs from 'dayjs';

import { CreateSignedURLS } from './interfaces';

@Injectable()
export class CloudFrontService {
  private cloudFrontKey: string;
  private cloudFrontKeyPairId: string;
  private cloudFrontDistributionDomainName: string;

  private readonly logger = new Logger(CloudFrontService.name);

  constructor(private configService: ConfigService) {
    this.cloudFrontKey = this.configService.get('CLOUDFRONT_PRIVATE_KEY');
    this.cloudFrontKeyPairId = this.configService.get('CLOUDFRONT_KEY_PAIR_ID');
    this.cloudFrontDistributionDomainName = this.configService.get(
      'CLOUDFRONT_DISTRIBUTION_DOMAIN_NAME',
    );
  }

  createSignedUrls(options: CreateSignedURLS) {
    const limitDate = dayjs().add(1, 'd').format('YYYY-MM-DD');

    try {
      const url = getSignedUrl({
        url: `${this.cloudFrontDistributionDomainName}/${options.bucketKey}`,
        privateKey: this.cloudFrontKey,
        keyPairId: this.cloudFrontKeyPairId,
        dateLessThan: limitDate,
      });

      return url;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
