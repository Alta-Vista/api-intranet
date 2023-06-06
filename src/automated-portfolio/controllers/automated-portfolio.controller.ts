import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { AutomatedPortfolioService } from '../services/automated-portfolio.service';
import {
  CreateAutomatedPortfolioRequestDto,
  ListClientPortfolioDto,
  ListRequestedAssetsDto,
} from '../dto';
import { AuthorizationGuard } from '../../authorization/authorization.guard';
import { Collaborator } from '../../authorization/collaborator.decorator';
import { collaboratorAuthInterface } from '../../auth-provider/interfaces/collaborators-auth.interface';
import { ListRequestsDto } from '../dto/list-requests.dto';
import { ListRequestTransformerInterceptor } from '../interceptors';
import { ListAutomatedPortfolioTransformerInterceptor } from '../interceptors/list-automated-portfolio-transformer.interceptor';
import { ListRequestAssetsTransformerInterceptor } from '../interceptors/list-request-assets-transformer.interceptor';

@Controller('automated-portfolio')
@UseGuards(AuthorizationGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class AutomatedPortfolioController {
  constructor(
    private readonly automatedPortfolioService: AutomatedPortfolioService,
  ) {}

  @Post('/assets')
  create(
    @Body() createMesaRvDto: CreateAutomatedPortfolioRequestDto,
    @Collaborator() collaborator: collaboratorAuthInterface,
  ) {
    const advisor = collaborator['http://user/metadata'].Assessor;
    return this.automatedPortfolioService.create(createMesaRvDto, advisor);
  }

  @Get('portfolio')
  listPortfolio(
    @Query() listClientPortfolioDto: ListClientPortfolioDto,
    @Collaborator() collaborator: collaboratorAuthInterface,
  ) {
    const advisor = collaborator['http://user/metadata'].Assessor;

    return this.automatedPortfolioService.listClientPortfolio(
      listClientPortfolioDto,
      advisor,
    );
  }

  @Get('/assets')
  @UseInterceptors(ListRequestTransformerInterceptor)
  listRequests(
    @Query() listRequestsDto: ListRequestsDto,
    @Collaborator() collaborator: collaboratorAuthInterface,
  ) {
    const advisor = collaborator['http://user/metadata'].Assessor;
    return this.automatedPortfolioService.listRequests(
      {
        limit: listRequestsDto.limit || 10,
        offset: listRequestsDto.offset || 1,
      },
      advisor,
    );
  }

  @Get('/requests/assets')
  @UseInterceptors(ListRequestAssetsTransformerInterceptor)
  listRequestedAssets(@Query() listRequestedAssets: ListRequestedAssetsDto) {
    return this.automatedPortfolioService.listRequestAssets(
      listRequestedAssets,
    );
  }

  @Get('/')
  @UseInterceptors(ListAutomatedPortfolioTransformerInterceptor)
  listAutomatedPortfolio() {
    return this.automatedPortfolioService.lisAutomatedPortfolio();
  }
}
