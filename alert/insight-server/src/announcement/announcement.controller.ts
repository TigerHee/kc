import { AnnouncementService } from './announcement.service';
import { Body, Controller, Delete, Get, Param, Post, Query, Req } from '@nestjs/common';
import { BreakdownAnnouncementDocument } from './schemas/breakdown-announcement.schema';
import { FeatureAnnouncementDocument } from './schemas/feature-announcement.schema';
import { RequestWithUser } from 'src/auth/auth.types';

@Controller('announcement')
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {
    //
  }

  @Get('/feature-upgrade')
  async systemFeatureUpgradeList(@Query('current') current: number, @Query('pageSize') pageSize: number) {
    return this.announcementService.featureList({
      current,
      pageSize,
    });
  }

  @Delete('/feature-upgrade/:id')
  async systemFeatureUpgradeDelete(@Param('id') id: string) {
    return this.announcementService.deleteFeatureAnnouncement(id);
  }

  @Post('/feature-upgrade')
  async systemFeatureUpgrade(@Body() body: FeatureAnnouncementDocument, @Req() req: RequestWithUser) {
    return await this.announcementService.publishFeatureAnnouncement(body, req.user);
  }

  @Get('/system-breakdown')
  async systemBreakdownList(@Query('current') current: number, @Query('pageSize') pageSize: number) {
    return this.announcementService.breakdownList({
      current,
      pageSize,
    });
  }

  @Post('/system-breakdown')
  async systemBreakdown(@Body() body: BreakdownAnnouncementDocument, @Req() req: RequestWithUser) {
    return await this.announcementService.publishBreakdownAnnouncement(body, req.user);
  }
}
