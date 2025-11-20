import { Module } from '@nestjs/common';
import { PipelineController } from './pipeline.controller';
import { NotificationLarkService } from 'src/notification/services/lark.notification.service';

@Module({
  imports: [],
  providers: [
    // 外部服务
    NotificationLarkService,
  ],
  controllers: [PipelineController],
  exports: [],
})
export class PipelineModule {
  //
}
