import { Controller, Get, SetMetadata, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthorizationGuard } from './authorization/authorization.guard';
import { PermissionsGuard } from './authorization/permissions.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(AuthorizationGuard, PermissionsGuard)
  @SetMetadata('permissions', ['read'])
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
