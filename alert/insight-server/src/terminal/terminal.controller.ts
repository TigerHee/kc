import { Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UserService } from 'src/auth/services/user.service';
import { TerminalService } from './terminal.service';
import { TerminalAuthGuard } from './terminal.auth.guard';
import { InsightTasksServices } from 'src/insight/services/tasks.insight.service';
import { TasksRequestDocument } from 'src/insight/schemas/tasks.schema';
import { RequestWithUser } from 'src/auth/auth.types';

@UseGuards(TerminalAuthGuard)
@Controller('terminal')
export class TerminalController {
  constructor(
    private readonly userService: UserService,
    private readonly terminalService: TerminalService,
    private readonly insightTasksService: InsightTasksServices,
  ) {
    //
  }

  @Post('login')
  async loginTerminal(@Body() body: { username: string; password: string }) {
    const { username, password } = body;
    const user = await this.userService.getUserByEmail(username);
    if (user.terminalPassword === undefined || user.terminalPassword === null || user.terminalPassword === '') {
      throw new UnauthorizedException('用户未设置终端密码');
    }
    if (!user || user.terminalPassword !== password) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    const token = await this.terminalService.createToken({
      username: user.name,
      email: user.email,
    });

    return {
      token: token,
      username: user.name,
      email: user.email,
    };
  }

  @Get('tasks')
  async getTaskList(@Req() request) {
    const data = await this.terminalService.getTaskList(request);
    return data;
  }

  @Post('task')
  async createTask(@Body() data: TasksRequestDocument, @Req() req: RequestWithUser) {
    const res = await this.insightTasksService.create(req, data);
    return res;
  }
}
