import { Body, Controller, Delete, Param, Put } from '@nestjs/common';
import { AgendaActionService } from '../services/action.agenda.service';

@Controller('agenda/task/action')
export class AgendaActionController {
  constructor(private readonly agendaActionService: AgendaActionService) {
    //
  }

  @Put('disable/:id')
  async disableTask(@Param('id') id: string) {
    return this.agendaActionService.disableTask(id);
  }

  @Put('enable/:id')
  async enableTask(@Param('id') id: string) {
    return this.agendaActionService.enableTask(id);
  }

  @Delete('remove/:id')
  async removeTask(@Param('id') id: string) {
    return this.agendaActionService.removeTask(id);
  }

  @Put('cancel/:id')
  async cancelTask(@Param('id') id: string, @Body('reason') reason?: string) {
    return this.agendaActionService.cancelTask(id, reason);
  }

  @Put('manual-complete/:id')
  async manualCompleteTask(@Param('id') id: string) {
    return this.agendaActionService.manualCompleteTask(id);
  }

  @Delete('purge')
  async purgeTask() {
    const data = await this.agendaActionService.purgeTask();
    return {
      number: data,
    };
  }
}
