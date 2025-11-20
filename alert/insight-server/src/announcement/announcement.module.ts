import { Module } from '@nestjs/common';
import { AnnouncementController } from './announcement.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FeatureAnnouncement, FeatureAnnouncementSchema } from './schemas/feature-announcement.schema';
import { BreakdownAnnouncement, BreakdownAnnouncementSchema } from './schemas/breakdown-announcement.schema';
import { AnnouncementService } from './announcement.service';
import { NotificationLarkService } from 'src/notification/services/lark.notification.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FeatureAnnouncement.name, schema: FeatureAnnouncementSchema },
      { name: BreakdownAnnouncement.name, schema: BreakdownAnnouncementSchema },
    ]),
    // 外部模块
    AuthModule,
  ],
  providers: [
    // 内部服务
    AnnouncementService,
    // 外部服务
    NotificationLarkService,
  ],
  controllers: [AnnouncementController],
  exports: [],
})
export class AnnouncementModule {
  //
}
