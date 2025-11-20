import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OffconfigJsDocument = OffconfigJs & Document;

@Schema({ collection: 'offconfig-js-scans' })
export class OffconfigJs {
  @Prop({ required: true, type: String })
  repo: string;

  @Prop({ required: false, type: String, default: 'master' })
  branch: string;

  @Prop({ required: true, type: String })
  slug: string;

  @Prop({ required: false, type: String, default: 'dist' })
  projectDistDirName: string;

  @Prop({ required: false, type: Number })
  maximumFileSizeToCacheInBytes: number;

  @Prop({ required: false, type: [String], default: [] })
  globPatterns: string[];

  @Prop({ required: false, type: Boolean })
  onlyFullPkg: boolean;

  @Prop({ required: false, type: Object, default: {} })
  multiTenantSite: {
    [key: string]: {
      name: string;
      sourceName: string;
      appVersion: string;
    };
  };

  @Prop({ required: true, type: Date, default: Date.now })
  createdAt: Date;
}

const OffconfigJsSchema = SchemaFactory.createForClass(OffconfigJs);

export { OffconfigJsSchema };
