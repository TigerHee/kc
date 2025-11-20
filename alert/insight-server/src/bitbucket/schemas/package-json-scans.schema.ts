import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PackageJsScanDocument = PackageJsScan & Document;

@Schema({ collection: 'package-json-scans' })
export class PackageJsScan {
  @Prop({ required: true, type: String })
  repo: string;

  @Prop({ required: false, type: String, default: 'master' })
  branch: string;

  @Prop({ required: true, type: String })
  slug: string;

  @Prop({ required: true, type: Boolean, default: false })
  webChecker: boolean;

  @Prop({ required: true, type: Boolean, default: false })
  webTest: boolean;

  @Prop({ required: true, type: Boolean, default: false })
  appOffline: boolean;

  @Prop({ required: true, type: Array, default: [] })
  deps: {
    name: string;
    version: string;
    isLock: boolean;
    type: 'dependencies' | 'devDependencies' | 'peerDependencies';
  }[];

  @Prop({ required: true, type: Date, default: Date.now })
  createdAt: Date;
}

const PackageJsScanSchema = SchemaFactory.createForClass(PackageJsScan);

export { PackageJsScanSchema };
