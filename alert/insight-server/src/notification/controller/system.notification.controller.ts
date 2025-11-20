import { Body, Controller, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
import { SystemNotificationService } from '../services/system.notification.service';
import { SystemMessageDocument } from '../schemas/system-message.schema';
import { RequestWithUser } from 'src/auth/auth.types';

@Controller('notification/system')
export class SystemNotificationController {
  constructor(private readonly systemNotificationService: SystemNotificationService) {
    //
  }

  @Get('')
  async getSystemNotificationList(
    @Req() req: RequestWithUser,
    @Query('current') current: number,
    @Query('pageSize') pageSize: number,
  ) {
    const res = await this.systemNotificationService.getSystemNotificationList({
      sendTo: req.user.id,
      current,
      pageSize,
    });
    return res;
  }

  @Post('')
  async addSystemNotification(@Body() data: SystemMessageDocument) {
    const res = await this.systemNotificationService.addSystemNotification(data);
    return res;
  }

  @Put(':id/read')
  async readSystemNotification(@Param('id') id: string) {
    const res = await this.systemNotificationService.readSystemNotification(id);
    return res;
  }

  @Get('unread')
  async getSystemNotificationCount(@Req() req: RequestWithUser) {
    const res = await this.systemNotificationService.getSystemNotificationUnreadCount({
      sendTo: req.user.id,
    });
    return res;
  }
}
