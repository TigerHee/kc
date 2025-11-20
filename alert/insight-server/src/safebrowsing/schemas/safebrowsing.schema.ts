import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PlatformType, ThreatEntry, ThreatEntryMetadata, ThreatEntryType, ThreatType } from '../safebrowsing.types';

export type SafebrowsingScanDocument = SafebrowsingScan & Document;

@Schema({ collection: 'safebrowsing-scans' })
export class SafebrowsingScan {
  @Prop({ type: String, enum: ThreatType, required: true })
  threatType: ThreatType; // 威胁类型

  @Prop({ type: String, enum: PlatformType, required: true })
  platformType: PlatformType; // 平台类型

  @Prop({ type: String, enum: ThreatEntryType, required: true })
  threatEntryType: ThreatEntryType; // 威胁条目类型

  @Prop({
    type: {
      hash: { type: String, default: null },
      url: { type: String, default: null },
      digest: { type: String, default: null },
    },
    required: true,
  })
  threat: ThreatEntry; // 威胁条目，包含哈希、URL 和摘要

  @Prop({
    type: [
      {
        key: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    default: [],
  })
  threatEntryMetadata: ThreatEntryMetadata['entries']; // 威胁条目元数据

  @Prop({ type: String, required: true })
  cacheDuration: string; // 缓存持续时间

  @Prop({ required: true })
  executor: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const SafebrowsingScanSchema = SchemaFactory.createForClass(SafebrowsingScan);
