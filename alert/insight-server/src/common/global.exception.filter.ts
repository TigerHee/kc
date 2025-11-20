import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  Logger,
} from '@nestjs/common';
import {
  Response,
  //  Request
} from 'express';
import { KunlunLogger } from './kunlun.logger';

@Catch()
// 接口异常拦截器
export class GlobalExceptionFilter implements ExceptionFilter {
  kunlunLogger = new KunlunLogger(GlobalExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = exception?.getStatus?.() || 500;

    // 控制台错误打印
    Logger.error(request.url, exception);

    let message = '';
    if (exception instanceof BadRequestException) {
      message = (exception.getResponse() as { message: string }).message || '请求错误';
    } else if (exception instanceof ForbiddenException) {
      message = exception.message ?? '权限错误';
    } else if (exception instanceof HttpException) {
      message = exception.message;
    } else {
      message = exception.message || '服务器错误';
    }

    // 记录错误日志
    this.kunlunLogger.error(
      JSON.stringify({
        status,
        message,
        request: {
          url: request.url,
          method: request.method,
          body: request.body,
        },
      }),
    );

    response.status(status).json({
      success: false,
      time: new Date(),
      data: null,
      code: status,
      message,
    });
  }
}
