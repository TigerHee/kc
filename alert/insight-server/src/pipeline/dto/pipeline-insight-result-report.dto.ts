import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';

export class PipelineInsightResultReportCoverage {
  @IsString()
  type: string;

  /**
   * 字符串或者数字
   */
  @IsString()
  total: string;

  @IsString()
  covered: string;

  @IsString()
  percentage: string;
}

export class PipelineInsightResultReportPipeline {
  @IsString()
  item: string;

  @IsString()
  result: string;

  @IsString()
  reason: string;
}

export class PipelineInsightResultReportDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PipelineInsightResultReportCoverage)
  coverage_table: PipelineInsightResultReportCoverage[];

  @IsString()
  project: string;

  @IsString()
  branch: string;

  @IsString()
  user: string;

  @IsString()
  commit_id: string;

  @IsString()
  commit_url: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PipelineInsightResultReportPipeline)
  pipeline_table: PipelineInsightResultReportPipeline[];

  @IsString()
  build_report_url: string;

  @IsString()
  check_report_url: string;
}
