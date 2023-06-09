import {
  Controller,
  UseGuards,
  Get,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
  Put,
  Body,
} from '@nestjs/common';

import { AuthorizationGuard } from '../../authorization/authorization.guard';
import {
  ListAvailableAssetsTransformerInterceptor,
  ListRequestTransformerInterceptor,
} from '../interceptors';
import {
  ListClientPortfolioDto,
  ListRequestsDto,
  UpdateAutomatedPortfolioDto,
} from '../dto';
import { AutomatedPortfolioAdminService } from '../services/automated-portfolio-admin.service';
import { Permissions } from '../../authorization/permissions.decorator';

@Controller('admin/automated-portfolio')
@UseGuards(AuthorizationGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class AutomatedPortfolioAdminController {
  constructor(
    private readonly automatedPortfolioService: AutomatedPortfolioAdminService,
  ) {}

  @Put('/requests/assets')
  @Permissions({
    permissions: ['update:assets-requests'],
  })
  updateRequestedAssets(
    @Body() updateAutomatedPortfolioDto: UpdateAutomatedPortfolioDto,
  ) {
    return this.automatedPortfolioService.updateRequestedAssets(
      updateAutomatedPortfolioDto,
    );
  }

  @Get('/client/portfolio')
  listPortfolio(@Query() listClientPortfolioDto: ListClientPortfolioDto) {
    return this.automatedPortfolioService.listClientPortfolio(
      listClientPortfolioDto,
    );
  }

  @Get('/requests')
  @Permissions({
    permissions: ['read:assets-requests'],
  })
  @UseInterceptors(ListRequestTransformerInterceptor)
  listRequests(@Query() listRequestsDto: ListRequestsDto) {
    return this.automatedPortfolioService.listRequests({
      limit: listRequestsDto.limit || 10,
      offset: listRequestsDto.offset || 1,
      advisor: listRequestsDto.advisor,
      client: listRequestsDto.client,
    });
  }

  @Get('/requests/available-assets')
  @Permissions({
    permissions: ['read:assets-requests'],
  })
  @UseInterceptors(ListAvailableAssetsTransformerInterceptor)
  listAllAvailableRequestedAssets() {
    return this.automatedPortfolioService.listAllRequestedAssets();
  }
}
