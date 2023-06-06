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
import { ListRequestTransformerInterceptor } from '../interceptors';
import { ListRequestsDto, UpdateAutomatedPortfolioDto } from '../dto';
import { AutomatedPortfolioAdminService } from '../services/automated-portfolio-admin.service';
import { Permissions } from '../../authorization/permissions.decorator';

@Controller('admin/automated-portfolio')
@UseGuards(AuthorizationGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class AutomatedPortfolioAdminController {
  constructor(
    private readonly automatedPortfolioService: AutomatedPortfolioAdminService,
  ) {}

  @Put('/assets')
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

  @Get('/assets')
  @Permissions({
    permissions: ['read:assets-requests'],
  })
  @UseInterceptors(ListRequestTransformerInterceptor)
  listRequestedAssets(@Query() listRequestsDto: ListRequestsDto) {
    return this.automatedPortfolioService.listRequestes({
      limit: listRequestsDto.limit || 10,
      offset: listRequestsDto.offset || 1,
      advisor: listRequestsDto.advisor,
    });
  }

  @Get('/assets/available')
  @Permissions({
    permissions: ['read:assets-requests'],
  })
  @UseInterceptors(ListRequestTransformerInterceptor)
  listAllAvailableRequestedAssets() {
    return this.automatedPortfolioService.generateAvailableAssetsCSV();
  }
}
