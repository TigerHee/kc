import { Body, Controller, Post, Req, UsePipes } from '@nestjs/common';
import { ScheduleParamsDynamicPipeline } from '../pipeline/schedule-params.dynamic.pipeline';
import { ScheduleTriggerEnum, ScheduleTypeEnum } from '../types';
import { ImmediateJobDto, IntervalJobDto, ScheduleJobDto } from '../dto/schedule-job-params.dto';
import { Roles } from 'src/auth/roles.decorator';
import { InvokeAgendaService } from '../services/invoke.agenda.service';
import { AuthRoleEnum } from 'src/auth/constants/user.constant';

@Controller('agenda/task/invoke')
export class AgendaInvokeController {
  constructor(private readonly invokeAgendaService: InvokeAgendaService) {
    //
  }

  @Post('interval')
  @UsePipes(new ScheduleParamsDynamicPipeline(ScheduleTypeEnum.INTERVAL))
  @Roles(AuthRoleEnum.ADMIN, AuthRoleEnum.SUPER_ADMIN)
  async scheduleTask(@Body() body: IntervalJobDto, @Req() req) {
    const { name, interval, payload } = body;
    const { user } = req;
    return this.invokeAgendaService.callTaskInterval(name, interval, {
      payload,
      interval,
      triggerUser: user?.name ?? 'system',
      triggerSource: ScheduleTriggerEnum.API,
    });
  }

  @Post('schedule')
  @UsePipes(new ScheduleParamsDynamicPipeline(ScheduleTypeEnum.SCHEDULE))
  @Roles(AuthRoleEnum.ADMIN, AuthRoleEnum.SUPER_ADMIN)
  async scheduleTaskSchedule(@Body() body: ScheduleJobDto, @Req() req) {
    const { cron, name, payload } = body;
    const { user } = req;
    return this.invokeAgendaService.callTaskSchedule(cron, name, {
      payload,
      cron,
      triggerUser: user?.name ?? 'system',
      triggerSource: ScheduleTriggerEnum.API,
    });
  }

  @Post('immediate')
  @UsePipes(new ScheduleParamsDynamicPipeline(ScheduleTypeEnum.IMMEDIATE))
  @Roles(AuthRoleEnum.ADMIN, AuthRoleEnum.SUPER_ADMIN)
  async scheduleImmediate(@Body() body: ImmediateJobDto, @Req() req) {
    const { name, payload } = body;
    const { user } = req;
    return this.invokeAgendaService.callTaskImmediate(name, {
      payload,
      triggerUser: user?.name ?? 'system',
      triggerSource: ScheduleTriggerEnum.API,
    });
  }
}
