import { Module } from '@nestjs/common';
import { SafebrowsingHttpModule } from './safebrowsing.http.module';
import { SafebrowsingService } from './services/safebrowsing.service';
import { SafebrowsingController } from './safebrowsing.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SafebrowsingScan, SafebrowsingScanSchema } from './schemas/safebrowsing.schema';
import { NotificationTeamsService } from 'src/notification/services/teams.notification.service';

@Module({
  imports: [
    SafebrowsingHttpModule.register(),
    MongooseModule.forFeature([{ name: SafebrowsingScan.name, schema: SafebrowsingScanSchema }]),
  ],
  providers: [
    SafebrowsingService,

    // 外部服务
    NotificationTeamsService,
  ],
  controllers: [SafebrowsingController],
  exports: [SafebrowsingService],
})
export class SafebrowsingModule {
  //
}
