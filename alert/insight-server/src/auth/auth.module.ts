import { Global, Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApiKeysService } from './services/apikeys.service';
import { ApiKeys, ApiKeysSchema } from './schemas/apikeys.schema';
import { AzureService } from './services/azure.service';
import { UserService } from './services/user.service';
import { PrRejectRecord, PrRejectRecordSchema } from './schemas/pr-reject-record.user.schema';
import { UserLog, UserLogSchema } from './schemas/user-log.schema';
import { ApiKeysController } from './controller/apikeys.controller';
import { AuthController } from './controller/auth.controller';
import { UserController } from './controller/user.controller';

@Global()
@Module({
  controllers: [ApiKeysController, AuthController, UserController],
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: ApiKeys.name, schema: ApiKeysSchema },
      { name: PrRejectRecord.name, schema: PrRejectRecordSchema },
      { name: UserLog.name, schema: UserLogSchema },
    ]),
  ],
  providers: [AuthService, ApiKeysService, AzureService, UserService],
  exports: [JwtModule, AuthService, ApiKeysService, AzureService, UserService],
})
export class AuthModule {
  //
}
