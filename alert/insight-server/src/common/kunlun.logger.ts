import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

export class KunlunLogger extends Logger {
  private logger;
  private _context: string;
  private flag: boolean;

  constructor(context?: string) {
    super(context);
    this._context = context;
    const configService = new ConfigService();
    this.flag = configService.get<string>('KUNLUN_LOGGER') === 'false' ? false : true;
    this.logger = createLogger({
      level: 'info',
      format: format.combine(format.timestamp(), format.json()),
      transports: [
        new transports.DailyRotateFile({
          filename: 'application-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          dirname: 'logs', // 日志目录
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
        }),
      ],
    });
  }

  log(message: any) {
    // 调用父类的 log 方法
    super.log(message);
    if (this.flag) {
      // 输出到 winston
      const msg = this._context ? `[${this._context}] ${message}` : message;
      this.logger.info(msg);
    }
  }

  error(message: any, trace?: string) {
    // 调用父类的 error 方法
    super.error(message, trace);
    if (this.flag) {
      // 输出到 winston
      const msg = this._context ? `[${this._context}] ${message}` : message;
      this.logger.error(msg);
    }
  }

  warn(message: any) {
    // 调用父类的 warn 方法
    super.warn(message);
    if (this.flag) {
      // 输出到 winston
      const msg = this._context ? `[${this._context}] ${message}` : message;
      this.logger.warn(msg);
    }
  }

  debug(message: any) {
    // 调用父类的 debug 方法
    super.debug(message);
    if (this.flag) {
      // 输出到 winston
      const msg = this._context ? `[${this._context}] ${message}` : message;
      this.logger.debug(msg);
    }
  }

  verbose(message: any) {
    // 调用父类的 verbose 方法
    super.verbose(message);
    if (this.flag) {
      // 输出到 winston
      const msg = this._context ? `[${this._context}] ${message}` : message;
      this.logger.verbose(msg);
    }
  }
}
