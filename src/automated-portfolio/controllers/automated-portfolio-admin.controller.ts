import {
  Controller,
  UseGuards,
  Get,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';

import { AuthorizationGuard } from '../../authorization/authorization.guard';
import { ListRequestTransformerInterceptor } from '../interceptors';
import { ListRequestedAssetsDto } from '../dto';
import { AutomatedPortfolioAdminService } from '../services/automated-portfolio-admin.service';

@Controller('admin/automated-portfolio')
@UseGuards(AuthorizationGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class AutomatedPortfolioAdminController {
  constructor(
    private readonly automatedPortfolioService: AutomatedPortfolioAdminService,
  ) {}

  @Get('/assets')
  @UseInterceptors(ListRequestTransformerInterceptor)
  listRequestedAssets(@Query() listRequestedAssetsDto: ListRequestedAssetsDto) {
    return this.automatedPortfolioService.listRequestedAssets({
      limit: listRequestedAssetsDto.limit || 10,
      offset: listRequestedAssetsDto.offset || 1,
    });
  }
}
