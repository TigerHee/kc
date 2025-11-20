import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';

export type BreakdownAnnouncementDocument = BreakdownAnnouncement & Document;

@Schema({ collection: 'breakdown-announcement' })
export class BreakdownAnnouncement {
  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  user: Types.ObjectId | User;

  @Prop({ required: true })
  startAt: string;

  @Prop({ required: true })
  finishAt: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const BreakdownAnnouncementSchema = SchemaFactory.createForClass(BreakdownAnnouncement);
