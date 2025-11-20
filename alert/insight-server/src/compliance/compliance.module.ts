import { Module } from '@nestjs/common';
import { ComplianceScanService } from './services/scan.compliance.service';
import { BitbucketComplianceService } from 'src/bitbucket/services/compliance.bitbucket.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ComplianceAtomic, ComplianceAtomicSchema } from './schemas/compliance-atomic.schema';
import { ComplianceDemand, ComplianceDemandSchema } from './schemas/compliance-demand.schema';
import { ComplianceController } from './controllers/compliance.controller';
import { ComplianceService } from './services/compliance.service';
import { ComplianceScanReport, ComplianceScanReportSchema } from './schemas/compliance-scan-report.schema';
import { NotificationLarkService } from 'src/notification/services/lark.notification.service';

@Module({
  controllers: [ComplianceController],
  imports: [
    MongooseModule.forFeature([
      { name: ComplianceAtomic.name, schema: ComplianceAtomicSchema },
      { name: ComplianceDemand.name, schema: ComplianceDemandSchema },
      { name: ComplianceScanReport.name, schema: ComplianceScanReportSchema },
    ]),
  ],
  providers: [
    ComplianceService,
    ComplianceScanService,
    // 外部模块
    BitbucketComplianceService,
    NotificationLarkService,
  ],
  exports: [ComplianceScanService],
})
export class ComplianceModule {
  //
}
