import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Projects } from './projects.schema';
import { Types, Document } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';

export type RoutesDocument = Routes & Document;

@Schema({ collection: 'routes' })
export class Routes extends Document {
  /**
   * 废弃字段
   */
  @Prop({ required: false, type: String })
  originalId: string;

  /**
   * 废弃字段
   */
  @Prop({ required: false, default: '', type: String })
  originalOwner: string;

  @Prop({
    required: false,
    type: Types.ObjectId,
    ref: Projects.name,
    default: null,
  })
  project: Projects | Types.ObjectId;

  @Prop({
    required: false,
    /**
     * { okx: {}, binance: {}, huobi: {}, bybit: {}, bitget: {}, mexc: {}, gate: {} }
     */
    default: '',
    type: String,
  })
  competitor: object;

  @Prop({ required: false, default: '', type: String })
  projectName: string; // slug

  @Prop({ required: false, type: Types.ObjectId, ref: User.name })
  user: User | Types.ObjectId;

  @Prop({ required: false, default: ['KC', 'TH', 'TR'], type: [String] })
  tenant: string[];

  @Prop({ required: true, default: '', type: String })
  path: string;

  @Prop({ required: false, default: '', type: String })
  accessibleLink: string;

  @Prop({ required: false, default: false, type: Boolean })
  isNeedLogin: boolean;

  @Prop({ required: false, default: '', type: String })
  title: string;

  @Prop({ required: false, default: false, type: Boolean })
  isIgnore: boolean;

  @Prop({ required: false, default: false, type: Boolean })
  isDeleted: boolean;

  @Prop({ required: false, default: Date.now(), type: Date })
  createdAt: Date;

  @Prop({ required: false, default: null, type: Date })
  updatedAt: Date;
}

export const RoutesSchema = SchemaFactory.createForClass(Routes);
