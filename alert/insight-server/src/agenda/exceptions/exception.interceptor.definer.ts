import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  InternalServerErrorException,
} from '@nestjs/common';
import { Observable, catchError } from 'rxjs';
import { ExceptionHandlerService } from './exception.handler.service.definer';

@Injectable()
export class DefinerExceptionInterceptor implements NestInterceptor {
  constructor(private readonly errorHandler: ExceptionHandlerService) {
    //
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        console.log('DefinerExceptionInterceptor', context);
        const response = this.errorHandler.handleError(err);
        // 返回自定义错误信息
        throw new InternalServerErrorException(response);
      }),
    );
  }
}
