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
import { CollaboratorAuthInterface } from '../../auth-provider/interfaces/collaborators-auth.interface';
import { ListRequestsDto } from '../dto/list-requests.dto';
import {
  ListAutomatedPortfolioTransformerInterceptor,
  ListRequestTransformerInterceptor,
} from '../interceptors';
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
    @Collaborator() collaborator: CollaboratorAuthInterface,
  ) {
    const advisor = collaborator['http://user/metadata'].Assessor;
    return this.automatedPortfolioService.create(createMesaRvDto, advisor);
  }

  @Get('/client/portfolio')
  listPortfolio(
    @Query() listClientPortfolioDto: ListClientPortfolioDto,
    @Collaborator() collaborator: CollaboratorAuthInterface,
  ) {
    const advisor = collaborator['http://user/metadata'].Assessor;

    return this.automatedPortfolioService.listClientPortfolio(
      listClientPortfolioDto,
      advisor,
    );
  }

  @Get('/requests')
  @UseInterceptors(ListRequestTransformerInterceptor)
  listRequests(
    @Query() listRequestsDto: ListRequestsDto,
    @Collaborator() collaborator: CollaboratorAuthInterface,
  ) {
    const advisor = collaborator['http://user/metadata'].Assessor;
    return this.automatedPortfolioService.listRequests(
      {
        limit: listRequestsDto.limit || 10,
        offset: listRequestsDto.offset || 1,
        client: listRequestsDto.client,
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
