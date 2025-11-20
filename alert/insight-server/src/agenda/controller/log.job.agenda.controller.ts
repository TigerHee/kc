import { Controller, Get, Query } from '@nestjs/common';
import { AgendaJobsService } from '../services/jobs.agenda.service';

@Controller('agenda/task/log')
export class AgendaJobLogController {
  constructor(private readonly agendaJobsService: AgendaJobsService) {
    //
  }

  @Get('')
  async getJobLogs(
    @Query('name') name: string,
    @Query('jobId') jobid: string,
    @Query('status') status,
    @Query('current') current,
    @Query('pageSize') pageSize,
  ) {
    const data = await this.agendaJobsService.getJobAllLogs({ name, jobid, current, status, pageSize });
    return data;
  }
}
