import { Body, Controller, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
import { InsightRoutesService } from '../services/routes.insight.service';
import { RoutesDocument } from '../schemas/route.schema';
import { RequestWithUser } from 'src/auth/auth.types';

@Controller('routes')
export class InsightRoutesController {
  constructor(private readonly routeService: InsightRoutesService) {
    //
  }

  @Get('')
  async getRoutesList(
    @Query('current') current,
    @Query('pageSize') pageSize,
    @Query('path') path,
    @Query('title') title,
    @Query('accessibleLink') accessibleLink,
    @Query('isNeedLogin') isNeedLogin,
    @Query('isIgnore') isIgnore: string,
    @Query('isWaitingConfig') isWaitingConfig,
    @Query('user') user,
    @Query('tenant') tenant,
    @Query('project') project,
  ) {
    const data = await this.routeService.getRoutesList({
      current,
      pageSize,
      path,
      title,
      accessibleLink,
      isNeedLogin,
      isIgnore,
      isWaitingConfig,
      user,
      tenant,
      project,
    });
    return data;
  }

  @Post('')
  async createRoute(@Body() body: RoutesDocument, @Req() req: RequestWithUser) {
    const data = await this.routeService.createRoute(req, body);
    return data;
  }

  @Put(':id')
  async updateRoute(
    @Param('id') id: string,
    @Body() body: Pick<RoutesDocument, 'user' | 'title' | 'accessibleLink' | 'isNeedLogin' | 'isIgnore'>,
  ) {
    const data = await this.routeService.updateRoute(id, body);
    return data;
  }
}
