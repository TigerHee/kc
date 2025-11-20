import { Body, Controller, Post, Res } from '@nestjs/common';
import { PipelineInsightResultReportDto } from './dto/pipeline-insight-result-report.dto';
import { NotificationLarkService } from 'src/notification/services/lark.notification.service';
import { Response } from 'express';
import { KunlunLogger } from 'src/common/kunlun.logger';
import { PipelineService } from './pipeline.service';

@Controller('pipeline')
export class PipelineController {
  private readonly logger = new KunlunLogger(PipelineService.name);

  constructor(private readonly notificationLarkService: NotificationLarkService) {
    //
  }

  @Post('report')
  async insightResultReport(@Body() body: PipelineInsightResultReportDto, @Res() res: Response) {
    try {
      // commit_id > 10 位时， 只摘要后10位
      const value = {
        ...body,
        commit_id: body.commit_id.length > 10 ? body.commit_id.slice(-10) : body.commit_id,
        user: body.user.toLocaleLowerCase(),
      };
      await this.notificationLarkService.sendPipelineInform(value);
    } catch (error) {
      // 记录错误日志
      this.logger.error('发送LARK消息失败: ' + error);
      // 响应一个 500 的状态码返回
      return res.status(500).send({
        data: {
          code: 1,
          message: error,
        },
      });
    }
    // 响应一个 200 的状态码返回
    res.status(200).send({
      data: {
        code: 0,
        message: 'success',
      },
    });
  }
}
