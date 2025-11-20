import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';

export type FeatureAnnouncementDocument = FeatureAnnouncement & Document;

@Schema({ collection: 'feature-announcement' })
export class FeatureAnnouncement {
  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  user: Types.ObjectId | User;

  @Prop({ required: false, default: '' })
  manualsUrl: string;

  @Prop({ required: false, default: '' })
  featureUrl: string;

  @Prop({ required: true })
  feature: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const FeatureAnnouncementSchema = SchemaFactory.createForClass(FeatureAnnouncement);
