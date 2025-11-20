import { Module } from '@nestjs/common';
import { VirustotalHttpModule } from './virustotal.http.module';
import { VirustotalService } from './services/virustotal.service';
import { VirustotalController } from './virustotal.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { VirustotalScan, VirustotalScanSchema } from './schemas/virustotal.schema';
import { NotificationTeamsService } from 'src/notification/services/teams.notification.service';
import { NotificationLarkService } from 'src/notification/services/lark.notification.service';

@Module({
  imports: [
    VirustotalHttpModule.register(),
    MongooseModule.forFeature([{ name: VirustotalScan.name, schema: VirustotalScanSchema }]),
  ],
  providers: [
    VirustotalService,
    // 外部服务
    NotificationTeamsService,
    NotificationLarkService,
  ],
  controllers: [VirustotalController],
  exports: [VirustotalService],
})
export class VirustotalModule {
  //
}
