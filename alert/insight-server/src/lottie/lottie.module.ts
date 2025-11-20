import { Module } from '@nestjs/common';
import { LottieService } from './lottie.service';
import { LottieController } from './lottie.controller';
import { MulterModule } from '@nestjs/platform-express';
import * as os from 'os';
import * as path from 'path';

const { resolve } = path;

@Module({
  imports: [
    MulterModule.register({
      dest: resolve(os.tmpdir(), 'upload'),
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    }),
  ],
  providers: [LottieService],
  controllers: [LottieController],
})
export class LottieModule {}
