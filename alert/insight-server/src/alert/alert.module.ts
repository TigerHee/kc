import { Module } from '@nestjs/common';
import { NotificationLarkService } from 'src/notification/services/lark.notification.service';
import { AlertService } from './service/alert.service';
import { AlertGroupService } from './service/alert-group.service';
import { AlertController } from './controller/alert.controller';
import { AlertGroupController } from './controller/alert-group.controller';
import { AlertHttpModule } from './http/alert.http.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Alert, AlertSchema } from './schemas/alert.schema';
import { AlarmGroup, AlarmGroupSchema } from './schemas/alarm-group.schema';

@Module({
  imports: [
    AlertHttpModule.register(),
    MongooseModule.forFeature([
      { name: Alert.name, schema: AlertSchema },
      { name: AlarmGroup.name, schema: AlarmGroupSchema },
    ]),
  ],
  providers: [AlertService, AlertGroupService, NotificationLarkService],
  controllers: [AlertController, AlertGroupController],
  exports: [AlertService],
})
export class AlertModule {}
