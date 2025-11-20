import { BadRequestException, Body, Controller, Get } from '@nestjs/common';
import { TaskHybridStatusDto } from './dto/task-hybrid-status.dto';
import { InsightTasksServices } from 'src/insight/services/tasks.insight.service';

@Controller('kufox')
export class KufoxController {
  constructor(private readonly insightTasksServices: InsightTasksServices) {
    //
  }

  @Get('task/hybrid-status')
  public async getHybridStatus(@Body() body: TaskHybridStatusDto) {
    const { wikis } = body;

    if (wikis.length === 0) {
      throw new BadRequestException('wikis不能为空');
    }
    // console.log('wikis:', wikis);
    const tasks = await this.insightTasksServices.getTaskByWikis(wikis.map((wiki) => Number(wiki)));
    // console.log('tasks:', tasks);

    if (tasks.length === 0) {
      throw new BadRequestException('wikis任务异常: 任务不存在');
    }

    const hybridStatus = tasks.map((task) => {
      if (task.wiki?.needH5Audit && task.wiki.needH5Audit !== null) {
        if (task.wiki.h5AuditStatus && task.wiki.h5AuditStatus === true) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    });

    return hybridStatus.every((status) => status === true);
  }
}
