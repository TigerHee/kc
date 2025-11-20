import { Body, Controller, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
import { AlarmNotificationService } from '../services/alarm.notification.service';
import { RequestWithUser } from 'src/auth/auth.types';
import { WebhookInfoType } from 'src/bitbucket/types/webhook.types';

@Controller('notification/alarm')
export class AlarmNotificationController {
  constructor(private readonly alarmNotificationService: AlarmNotificationService) {
    //
  }

  @Get('')
  async getAlarmNotification(
    @Req() req: RequestWithUser,
    @Query('current') current: number,
    @Query('pageSize') pageSize: number,
  ) {
    const res = await this.alarmNotificationService.getAlarmNotificationList({
      author: req.user.id,
      current,
      pageSize,
    });
    return res;
  }

  // TODO：统一迁移到admin模块
  @Get('admin')
  async getAlarmNotificationForAdmin(@Query('current') current: number, @Query('pageSize') pageSize: number) {
    const res = await this.alarmNotificationService.getAlarmNotificationListForAdmin({
      current,
      pageSize,
    });
    return res;
  }

  @Put(':id/read')
  async readAlarmNotification(@Param('id') id: string) {
    const res = await this.alarmNotificationService.readAlarmNotification(id);
    return res;
  }

  @Get('unread')
  async getAlarmNotificationCount(@Req() req: RequestWithUser) {
    const res = await this.alarmNotificationService.getAlarmNotificationUnreadCount({
      author: req.user.email,
    });
    return res;
  }

  @Post('')
  async addAlarmNotification(@Body() data: Partial<WebhookInfoType>) {
    const res = await this.alarmNotificationService.addAlarmNotification(data);
    return res;
  }
}
