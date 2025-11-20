import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { User, UserDocument } from 'src/auth/schemas/user.schema';
import { ComplianceAtomic } from './compliance-atomic.schema';

export type ComplianceDemandDocument = ComplianceDemand & Document;

@Schema({ collection: 'compliance-demand' })
export class ComplianceDemand {
  /**
   * 需求名称
   */
  @Prop({ required: true, type: String })
  title: string;

  /**
   * 方案地址
   */
  @Prop({ required: false, type: String, default: '' })
  schemeUrl: string;

  /**
   * PRD地址
   */
  @Prop({ required: false, type: String, default: '' })
  prdUrl: string;

  /**
   * 上线时间
   */
  @Prop({ required: false, type: Date })
  publicAt: Date;

  /**
   * 负责人
   */
  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  owner: Types.ObjectId | UserDocument;

  /**
   * 巡检说明
   */
  @Prop({ required: false, type: String, default: '' })
  patrol: string;

  /**
   * 需求备注
   */
  @Prop({ required: false, type: String, default: '' })
  remark: string;

  /**
   * 创建时间
   */
  @Prop({ required: true, type: Date, default: Date.now })
  createdAt: Date;

  /**
   * 软删除
   */
  @Prop({ required: false, type: Boolean, default: false })
  isDeleted: boolean;

  /**
   * 关联原子扫描内容
   */
  @Prop({ required: false, type: [Types.ObjectId], ref: 'ComplianceAtomic' })
  codeScan: Types.ObjectId[] | ComplianceAtomic[];
}

export const ComplianceDemandSchema = SchemaFactory.createForClass(ComplianceDemand);
