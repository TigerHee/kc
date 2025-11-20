import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { InsightTasksServices } from 'src/insight/services/tasks.insight.service';

@Injectable()
export class TerminalService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly insightTasksServices: InsightTasksServices,
  ) {
    //
  }

  /**
   * 颁发jwt token
   */
  async createToken(data: { username: string; email: string }) {
    const token = await this.jwtService.sign(data, {
      expiresIn: '30d',
    });
    return token;
  }

  /**
   * jwt校验并获取用户信息
   */
  async verifyToken(token: string) {
    try {
      const data = this.jwtService.verify(token);
      return {
        ...data,
        token,
      } as {
        username: string;
        email: string;
        token: string;
      };
    } catch (error) {
      // 判断错误类型，jwt过期单独处理
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token 在 ' + error.expiredAt + ' 过期, 请重新登录');
      } else {
        throw new Error('token校验失败:' + error.message);
      }
    }
  }

  /**
   * 校验token
   * @param context
   * @returns
   */
  async auth(context: ExecutionContext): Promise<boolean> {
    // 获得header x-terminal-token的值
    const request = context.switchToHttp().getRequest();
    const token = request.headers['x-terminal-token'];
    if (!token) {
      return false;
    }
    const data = await this.verifyToken(token);
    // request 中添加user属性
    request.user = data;
    return true;
  }

  /**
   * 获取当前用户
   * @param request
   * @returns
   */
  async getCurrentUser(request) {
    // 从request中获取user属性
    return request.user;
  }

  /**
   * 获取任务列表
   */
  async getTaskList(request) {
    const user = await this.getCurrentUser(request);
    const res = await this.insightTasksServices.findMyTasks(user.email);
    // 首行增加固定的万能任务返回
    const fixedTask = {
      taskName: '[[[万能任务]]]',
      taskId: 't-ways-stop',
      wiki: {
        status: true,
        title: '万能任务无方案',
        url: '',
        errors: [],
      },
      wikiCheckerVersion: 1,
      user: user.email,
      status: false,
      involveRepos: [],
    };
    return [fixedTask, ...res];
  }
}
