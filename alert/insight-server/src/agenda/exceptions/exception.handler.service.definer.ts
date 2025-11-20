import { Injectable } from '@nestjs/common';

@Injectable()
export class ExceptionHandlerService {
  async handleError(error: any): Promise<any> {
    console.log('ExceptionHandlerService.error', error);
    // 在这里处理错误，并返回统一的响应
    // return {
    //   status: 'error',
    //   message: error.message || 'Internal Server Error',
    // };
  }
}
