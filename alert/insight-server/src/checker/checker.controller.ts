import { Controller, Get, Param } from '@nestjs/common';
import { InsightTasksServices } from 'src/insight/services/tasks.insight.service';

@Controller('/checker')
export class CheckerController {
  constructor(private readonly insightTasksServices: InsightTasksServices) {
    //
  }
  /**
   * @deprecated
   * kc-web-checker
   */
  @Get('tasks/wiki-status/:taskId')
  async task(@Param('taskId') taskId: string) {
    const res = [];
    const data = await this.insightTasksServices.findOneByJobId(taskId);
    res.push({
      status: data?.wiki?.status ?? false,
    });
    return res;
  }
}
