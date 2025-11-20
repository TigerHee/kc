import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MustReadWikiListDocument = MustReadWikiList & Document;

export interface ViewerItem {
  userId: string;
  displayName: string;
  views: number;
  lastViewedAt: string;
  lastVersionViewedNumber: number;
  lastVersionViewedUrl: string;
}

@Schema({ collection: 'must-read-wiki-list' })
export class MustReadWikiList {
  @Prop({ required: true, type: String })
  title: string;

  @Prop({ required: true, type: String })
  url: string;

  @Prop({ required: true, type: String })
  pageId: number;

  @Prop({ required: true, type: [], default: [] })
  viewers: ViewerItem[];

  @Prop({ required: false, type: Number, default: 0 })
  lastVersion: number;

  @Prop({ required: false, type: String })
  updatedAt: string;

  @Prop({ required: true, type: Date, default: Date.now })
  createdAt: string;

  @Prop({ required: true, type: Boolean, default: true })
  status: boolean;
}

export const MustReadWikiListSchema = SchemaFactory.createForClass(MustReadWikiList);
