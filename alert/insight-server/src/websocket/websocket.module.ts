import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PrRejectRecord, PrRejectRecordSchema } from 'src/auth/schemas/pr-reject-record.user.schema';
import { UserLog, UserLogSchema } from 'src/auth/schemas/user-log.schema';
import { User, UserSchema } from 'src/auth/schemas/user.schema';
import { AzureService } from 'src/auth/services/azure.service';
import { UserService } from 'src/auth/services/user.service';
import { AppGateway } from 'src/websocket/app.gateway';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: PrRejectRecord.name, schema: PrRejectRecordSchema },
      { name: UserLog.name, schema: UserLogSchema },
    ]),
  ],
  providers: [AppGateway, AzureService, UserService],
  exports: [AppGateway],
})
export class WebSocketModule {
  //
}
