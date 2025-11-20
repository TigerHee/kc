import { Controller, Get, Query, Logger, Param } from '@nestjs/common';
import { AgendaJobsService } from '../services/jobs.agenda.service';

@Controller('agenda/task')
export class AgendaTaskController {
  logger = new Logger(AgendaTaskController.name);

  constructor(private readonly agendaJobsService: AgendaJobsService) {
    //
  }

  @Get('')
  async getAllTasks(
    @Query('name') name: string,
    @Query('_id') id: string,
    @Query('type') type: string,
    @Query('isCompleted') isCompleted: boolean,
    @Query('current') current,
    @Query('priority') priority,
    @Query('pageSize') pageSize,
    @Query('orderField') orderField,
  ) {
    const data = await this.agendaJobsService.getAllJobs({
      id,
      name,
      type,
      isCompleted,
      current,
      priority,
      pageSize,
      orderField,
    });
    return data;
  }

  @Get('defined')
  async getDefinedTasks() {
    return this.agendaJobsService.getDefinedTasks();
  }

  @Get('schedule/:name')
  async getScheduleTaskByName(@Param('name') name: string) {
    return this.agendaJobsService.getScheduleTaskByName(name);
  }

  @Get('immediate/:name')
  async getImmediateTaskByName(@Param('name') name: string) {
    return this.agendaJobsService.getImmediateTaskByName(name);
  }

  @Get('interval/:name')
  async getIntervalTaskByName(@Param('name') name: string) {
    return this.agendaJobsService.getIntervalTaskByName(name);
  }

  @Get(':id/logs')
  async getTaskLogs(
    @Param('id') id: string,
    @Query('limit') limit,
    @Query('current') current,
    @Query('pageSize') pageSize,
  ) {
    return this.agendaJobsService.getTaskLogs({ id, current, pageSize, limit });
  }
}
