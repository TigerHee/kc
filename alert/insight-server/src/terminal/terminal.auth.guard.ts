import { TerminalService } from './terminal.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class TerminalAuthGuard implements CanActivate {
  constructor(private readonly terminalService: TerminalService) {
    //
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // terminal/login 路由跳过，通过路由的方式匹配
    if (context.switchToHttp().getRequest().url === '/terminal/login') {
      return true;
    }
    const res = await this.terminalService.auth(context);
    return res;
  }
}
