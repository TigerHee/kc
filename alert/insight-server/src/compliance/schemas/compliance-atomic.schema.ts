import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserDocument } from 'src/auth/schemas/user.schema';
import { ComplianceScanReport } from './compliance-scan-report.schema';

export type ComplianceAtomicDocument = ComplianceAtomic & Document;

@Schema({ collection: 'compliance-atomic' })
export class ComplianceAtomic {
  /**
   * 类型
   */
  @Prop({ required: true, type: String })
  type: string;

  /**
   * 代码位置 Line: xx Column: xx
   */
  @Prop({ required: false, type: String, default: '' })
  position: string;

  /**
   * 代码行数
   */
  @Prop({ required: true, type: Number, default: 0 })
  line: number;

  /**
   * 代码列数
   */
  @Prop({ required: true, type: Number, default: 0 })
  column: number;

  /**
   * 文件路径
   */
  @Prop({ required: true, type: String, default: '' })
  path: string;

  /**
   * spm
   */
  @Prop({ required: false, type: String, default: '' })
  spm: string | null;

  /**
   * 代码摘要
   */
  @Prop({ required: false, type: String, default: '' })
  code: string;

  /**
   * 注释内容
   */
  @Prop({ required: false, type: String, default: '' })
  comment: string;

  /**
   * 仓库分组
   */
  @Prop({ required: true, type: String, default: '' })
  slug: string;

  /**
   * 代码仓库
   */
  @Prop({ required: true, type: String, default: '' })
  repo: string;

  /**
   * 是否忽略, 标记误识别内容
   */
  @Prop({ required: false, type: Boolean, default: false })
  isSkip: boolean;

  /**
   * 是否软删除
   */
  @Prop({ required: false, type: Boolean, default: false })
  isDeleted: boolean;

  /**
   * 是否扫描删除,标记扫描到删除内容,人工识别是否需要真正删除
   */
  @Prop({ required: false, type: Boolean, default: false })
  isScanDeleted: boolean;

  /**
   * 创建时间
   */
  @Prop({ required: false, type: Date, default: Date.now })
  createdAt: Date;

  /**
   * 更新时间
   */
  @Prop({ required: false, type: Date })
  updatedAt: Date;

  /**
   * 更新人
   */
  @Prop({ required: false, type: Types.ObjectId, ref: 'User' })
  updatedBy: Types.ObjectId | UserDocument;

  /**
   * 报告ID
   */
  @Prop({ required: false, type: Types.ObjectId, ref: 'ComplianceScanReport' })
  report: Types.ObjectId | ComplianceScanReport;
}

export const ComplianceAtomicSchema = SchemaFactory.createForClass(ComplianceAtomic);
