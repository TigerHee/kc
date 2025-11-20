import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ComplianceScanReportDocument = ComplianceScanReport & Document;

@Schema({ collection: 'compliance-scan-report' })
export class ComplianceScanReport {
  @Prop({ required: true, type: String, default: '' })
  scanParams: string;

  /**
   * 删除的项JSON字符串
   */
  @Prop({ required: true, type: String, default: '' })
  deletingItems: string;

  /**
   * 添加的项JSON字符串
   */
  @Prop({ required: true, type: String, default: '' })
  addingItems: string;

  /**
   * 版本号，报告内容有可能会变更，渲染的组件需要版本
   */
  @Prop({ required: true, type: String, default: 'v1' })
  version: string;

  /**
   * 创建时间
   */
  @Prop({ required: true, type: Date, default: Date.now })
  createdAt: Date;

  /**
   * 软删除
   */
  @Prop({ required: true, type: Boolean, default: false })
  isDeleted: boolean;
}

export const ComplianceScanReportSchema = SchemaFactory.createForClass(ComplianceScanReport);
