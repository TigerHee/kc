import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VirustotalScanDocument = VirustotalScan & Document;

type AnalysisResult = {
  method: string; // 检测方法，例如 "blacklist"、"heuristics"
  engine_name: string; // 引擎名称，例如 "Acronis"
  category: string; // 检测分类，例如 "malicious"、"suspicious"、"harmless"
  result: string; // 检测结果，例如 "clean"、"blocked"
};

@Schema({ collection: 'virustotal-scans' })
export class VirustotalScan {
  @Prop({ required: true })
  id: string;

  @Prop({
    required: true,
    type: Object,
    default: {
      self: '',
    },
  })
  links: {
    self: string;
  };

  @Prop({ required: true, default: 0 })
  malicious: number;

  @Prop({ required: true, default: 0 })
  suspicious: number;

  @Prop({ type: Array, default: [] })
  analysisResults: AnalysisResult[];

  @Prop({ required: true })
  executor: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: null })
  updatedAt: Date;
}

export const VirustotalScanSchema = SchemaFactory.createForClass(VirustotalScan);
