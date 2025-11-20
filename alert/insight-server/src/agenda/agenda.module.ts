import { Global, Module, OnApplicationShutdown } from '@nestjs/common';
import { DiscoveryModule, ModuleRef } from '@nestjs/core';
import { Agenda } from '@hokify/agenda';
import { AgendaMetadataAccessor } from './agenda.metadata.accessor';
import { ConfigurableModuleClass } from './agenda.module.definition';
import { AgendaExplorer } from './agenda.explorer';
import { AgendaJobsService } from './services/jobs.agenda.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JobLog, JobLogSchema } from './schemas/job-log.schema';
import { GlobalJobDefiner } from './definer/global.job.definer';
import { AgendaLogService } from './services/log.agenda.service';
import { AgendaActionService } from './services/action.agenda.service';
import { OnetrustModule } from 'src/onetrust/onetrust.module';
import { InsightModule } from 'src/insight/insight.module';
import { SystemJobDefiner } from './definer/system.job.definer';
import { Jobs, JobsSchema } from './schemas/jobs.schema';
import { BitbucketModule } from 'src/bitbucket/bitbucket.module';
import { AzureService } from 'src/auth/services/azure.service';
import { AuthService } from 'src/auth/services/auth.service';
import { User, UserSchema } from 'src/auth/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/auth/services/user.service';
import { InvokeAgendaService } from './services/invoke.agenda.service';
import { SafebrowsingModule } from 'src/safebrowsing/safebrowsing.module';
import { VirustotalModule } from 'src/virustotal/virustotal.module';
import { DefinerExceptionInterceptor } from './exceptions/exception.interceptor.definer';
import { ProjectJobDefiner } from './definer/project.job.definer';
import { ExceptionHandlerService } from './exceptions/exception.handler.service.definer';
import { PrRejectRecord, PrRejectRecordSchema } from 'src/auth/schemas/pr-reject-record.user.schema';
import { UserLog, UserLogSchema } from 'src/auth/schemas/user-log.schema';
import { ComplianceModule } from 'src/compliance/compliance.module';
import { AlertModule } from 'src/alert/alert.module';

@Global()
@Module({
  imports: [
    DiscoveryModule,
    MongooseModule.forFeature([
      { name: JobLog.name, schema: JobLogSchema },
      { name: Jobs.name, schema: JobsSchema },
      { name: User.name, schema: UserSchema },
      { name: PrRejectRecord.name, schema: PrRejectRecordSchema },
      { name: UserLog.name, schema: UserLogSchema },
    ]),
    // 外部模块
    OnetrustModule,
    InsightModule,
    BitbucketModule,
    SafebrowsingModule,
    VirustotalModule,
    AlertModule,
    ComplianceModule,
  ],
  providers: [
    AgendaMetadataAccessor,
    AgendaExplorer,
    AgendaJobsService,
    AgendaLogService,
    AgendaActionService,
    InvokeAgendaService,
    ExceptionHandlerService,
    DefinerExceptionInterceptor,
    AzureService,
    AuthService,
    JwtService,
    UserService,

    // Job处理器
    GlobalJobDefiner,
    SystemJobDefiner,
    ProjectJobDefiner,
  ],
  exports: [
    AgendaJobsService,
    AgendaLogService,
    AgendaActionService,
    InvokeAgendaService,
    AgendaExplorer,
    ExceptionHandlerService,
  ],
})
export class AgendaModule extends ConfigurableModuleClass implements OnApplicationShutdown {
  constructor(private readonly modRef: ModuleRef) {
    super();
  }

  async onApplicationShutdown() {
    const agenda = this.modRef.get(Agenda);
    await agenda.stop();
  }
}
