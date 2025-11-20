import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SuccessResponseInterceptor } from './common/success.response.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/global.exception.filter';
import * as cookieParser from 'cookie-parser';
import { getSecrets } from './vault.config';
import * as express from 'express';

async function bootstrap() {
  await getSecrets();
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new SuccessResponseInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());

  /**
   * 全局使用 ValidationPipe
   */
  app.useGlobalPipes(
    new ValidationPipe({
      /**
       * 将请求数据转换为 DTO 类实例
       */
      transform: true,
      /**
       * 只接受 DTO 中定义的字段
       */
      whitelist: true,
      /**
       * 拒绝非 DTO 中定义的字段
       */
      forbidNonWhitelisted: true,
      /**
       * 拒绝未知值
       */
      // forbidUnknownValues: true,
    }),
  );
  /**
   * 使用 cookie-parser 中间件
   */
  app.use(cookieParser());

  // 设置请求体大小限制
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ limit: '2mb', extended: true }));

  await app.listen(process.env.REST_API_PORT || 3300);
}
bootstrap();
