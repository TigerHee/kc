import { Controller, Get, Post, Req, Body, Query } from '@nestjs/common';
import { AlertService } from '../service/alert.service';
import { STATUS_LIST } from '../utils';
import { ChangeAlertStatusDto, ChangeAlertDataDto } from '../dto/alert.dto';

@Controller('alert')
export class AlertController {
  constructor(private readonly alertService: AlertService) {
    //
  }

  @Post('scan')
  async scanAlerts(@Body() body: { start_time?: string; end_time?: string; hour?: string }, @Req() req) {
    const { user } = req;
    const data = await this.alertService.callTaskImmediateScanAlerts({ body, user });
    return data;
  }

  // 查询告警列表
  @Get('list')
  async getAlertList(
    @Query()
    query: {
      alarmGroup?: string;
      status?: string;
      alertMsg?: string;
      appKey?: string;
      isFinished?: 'true' | 'false';
      pageSize?: string;
      current?: string;
      relationUser?: string;
    },
  ) {
    const data = await this.alertService.getAlertList({
      alarmGroup: query.alarmGroup,
      status: query.status,
      alertMsg: query.alertMsg,
      appKey: query.appKey,
      isFinished: query.isFinished,
      pageSize: Number(query.pageSize) || 10,
      current: Number(query.current) || 1,
      relationUser: query.relationUser,
    });

    return data;
  }

  // 查询状态列表
  @Get('config/status')
  async getConfigStatus() {
    return STATUS_LIST;
  }

  // 查询告警详情
  @Get('detail')
  async getAlertDetail(
    @Query() query: { _id?: string; alarmGroup?: string; url?: string; message?: string },
    // @Req() req,
  ) {
    // const { user } = req;
    return this.alertService.getAlertDetail(
      query,
      // user
    );
  }

  // 修改告警状态
  @Post('change/status')
  async changeAlertStatus(@Body() body: ChangeAlertStatusDto, @Req() req) {
    const { user } = req;
    return this.alertService.changeAlertStatus({
      body,
      user,
    });
  }

  // 修改结果相关数据
  @Post('change/alert-data')
  async changeAlertData(@Body() body: ChangeAlertDataDto, @Req() req) {
    const { user } = req;
    return this.alertService.changeAlertData({
      body,
      user,
    });
  }

  @Get('analyze')
  async getAlertAnalyze(
    @Query()
    query: {
      startTime: number;
      endTime: number;
    },
  ) {
    const data = await this.alertService.getAlertAnalyze({
      startTime: Number(query.startTime),
      endTime: Number(query.endTime),
    });

    return data;
  }
}
