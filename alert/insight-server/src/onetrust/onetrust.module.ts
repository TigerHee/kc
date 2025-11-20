import { Module } from '@nestjs/common';
import { OnetrustService } from './services/onetrust.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OnetrustCookieScan, OnetrustCookieScanSchema } from './schemas/onetrust.cookies.schema';
import { NotificationTeamsService } from 'src/notification/services/teams.notification.service';
import { OnetrustHttpModule } from './onetrust.http.module';
import { OnetrustReportService } from './services/report.onetrust.service';
import { NotificationLarkService } from 'src/notification/services/lark.notification.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: OnetrustCookieScan.name, schema: OnetrustCookieScanSchema }]),
    OnetrustHttpModule.register(),
  ],
  providers: [
    // 内部服务
    OnetrustService,
    OnetrustReportService,

    // 外部服务
    NotificationTeamsService,
    NotificationLarkService,
  ],
  exports: [OnetrustService, OnetrustReportService],
})
export class OnetrustModule {
  //
}
