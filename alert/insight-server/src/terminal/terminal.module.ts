import { Module } from '@nestjs/common';
import { TerminalService } from './terminal.service';
import { TerminalController } from './terminal.controller';

@Module({
  imports: [],
  providers: [TerminalService],
  controllers: [TerminalController],
  exports: [],
})
export class TerminalModule {
  //
}
