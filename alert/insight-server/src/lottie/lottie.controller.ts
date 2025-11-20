import {
  Controller,
  HttpException,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { LottieService } from './lottie.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'node:fs';

@Controller('lottie')
export class LottieController {
  constructor(private readonly lottieService: LottieService) {
    //
  }

  /**
   * 获取的file参数是一个json文件
   * 原封不动返回
   * @param file
   * @returns
   */
  @Post('parse')
  @UseInterceptors(FileInterceptor('file'))
  async parse(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'json',
        })
        .addMaxSizeValidator({
          maxSize: 10 * 1024 * 1024,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new HttpException('file 参数为空', HttpStatus.BAD_REQUEST);
    }

    try {
      const buffer = fs.readFileSync(file.path);
      return JSON.parse(buffer.toString());
    } catch (error) {
      console.error(`Parse error: ${error.message}`);
      throw new HttpException('解析失败' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      // 只能一次交互，服务器不存储文件
      fs.unlinkSync(file.path);
    }
  }

  @Post('compress')
  @UseInterceptors(FileInterceptor('file'))
  async compress(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'json',
        })
        .addMaxSizeValidator({
          maxSize: 10 * 1024 * 1024,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new HttpException('file 参数为空', HttpStatus.BAD_REQUEST);
    }

    try {
      const buffer = fs.readFileSync(file.path);
      return await this.lottieService.compress(buffer);
    } catch (error) {
      console.error(`Compress error: ${error.message}`);
      throw new HttpException('压缩失败' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      // 只能一次交互，服务器不存储文件
      fs.unlinkSync(file.path);
    }
  }
}
