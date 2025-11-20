import { Module } from '@nestjs/common';
import { NotificationTeamsService } from './services/teams.notification.service';
import { TeamsHttpModule } from './teams.http.module';
import { AlarmMessage, AlarmMessageSchema } from './schemas/alarm-message.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AlarmNotificationService } from './services/alarm.notification.service';
import { SystemNotificationService } from './services/system.notification.service';
import { SystemMessage, SystemMessageSchema } from './schemas/system-message.schema';
import { AuthModule } from 'src/auth/auth.module';
import { LarkHttpModule } from './lark.http.module';
import { NotificationLarkService } from './services/lark.notification.service';

@Module({
  imports: [
    TeamsHttpModule.register(),
    LarkHttpModule.register(),
    MongooseModule.forFeature([
      { name: AlarmMessage.name, schema: AlarmMessageSchema },
      { name: SystemMessage.name, schema: SystemMessageSchema },
    ]),
    AuthModule,
  ],
  providers: [NotificationTeamsService, NotificationLarkService, AlarmNotificationService, SystemNotificationService],
  exports: [NotificationTeamsService, NotificationLarkService, AlarmNotificationService, SystemNotificationService],
})
export class NotificationModule {
  //
}
