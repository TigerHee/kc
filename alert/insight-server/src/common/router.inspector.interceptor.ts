import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { KunlunLogger } from './kunlun.logger';

@Injectable()
export class RouterInspectorInterceptor implements NestInterceptor {
  // private readonly logger = new Logger('InsightRouter');
  private readonly logger = new KunlunLogger('InsightRouter');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    let route = request.url;
    const method = request.method;

    // 以 /auth/callback 开头的请求 单独处理
    if (route.startsWith('/auth/callback')) {
      route = '/auth/callback';
    }

    let queryParams = '';
    let bodyParams = '';
    let authParams = '';

    if (request.query) {
      queryParams = JSON.stringify(request.query);
    }
    if (request.body) {
      bodyParams = JSON.stringify(request.body);
    }
    if (request.user) {
      authParams = request.user.type + ' [uid] ' + request.user.id + ' [role] ' + request.user.role;
    } else {
      authParams = '匿名';
    }

    this.logger.log(
      `🌍 请求 { ${method} } { ${route} } - [auth] ${authParams} - [query] ${queryParams} - [body] ${bodyParams}`,
    );

    return next.handle(); // 继续处理请求
  }
}
