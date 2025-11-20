import { Agenda } from '@hokify/agenda';
import { Controller, Get } from '@nestjs/common';

@Controller('agenda')
export class AgendaDashBoardController {
  constructor(private readonly agenda: Agenda) {
    //
  }

  @Get('')
  async state() {
    return this.agenda.getRunningStats();
  }
}
