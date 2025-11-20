import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
// import { UserDocument } from 'src/auth/schemas/user.schema';
// import { RepoEnum } from 'src/bitbucket/types/repo.types';
// import { ReposDocument } from 'src/insight/schemas/repos.schema';

export class OnetrustScanCookieDiffJobDto {
  @IsString()
  domain: string;

  @IsString()
  conversation: string;

  @IsArray()
  mentions: string[];

  @IsBoolean()
  verbose: boolean;
}

export class InsightSecretReplaceJobDto {
  @IsString()
  keyName: string;

  @IsString()
  user: string;
}

export class BitbucketScanRepoPackageJsonJobDto {
  // @IsEnum(RepoEnum)
  @IsString()
  repo: string;
}

export class BitbucketScanRepoJscramblerJobDto {
  // @IsEnum(RepoEnum)
  @IsString()
  repo: string;
}

export class BitbucketScanRepoOfflineJobDto {
  // @IsEnum(RepoEnum)
  @IsString()
  repo: string;
}

export class InsightProjectsRouteJobDto {
  //
}

export class KucoinSafeBrowsingJobDto {
  //
}

export class KucoinVirustotalJobDto {
  //
}

export class ProjectAutoWorkflowContextDto {
  @IsString()
  workflowRecord: string;

  @IsString()
  @IsOptional()
  project?: string;
}

export class ProjectAutoWorkflowJobDto {
  @IsString()
  workflowId: string;

  @IsString()
  projectId: string;

  @ValidateNested({ each: true })
  @IsNotEmpty()
  @Type(() => ProjectAutoWorkflowContextDto)
  context: ProjectAutoWorkflowContextDto;
}

export class KunlunScanAlertJobDto {
  @IsOptional()
  @IsString()
  start_time?: string;

  @IsOptional()
  @IsString()
  end_time?: string;

  @IsOptional()
  @IsString()
  hour?: string;
}

export class ScanAlertBacklogListJobDto {}

export class ComplianceCodeScanJobDto {
  @IsArray() // 验证这是一个数组
  @ArrayNotEmpty() // 验证数组不能为空
  @IsString({ each: true }) // 验证数组中的每个元素都是字符串
  @IsNotEmpty({ each: true }) // 验证数组中的每个字符串不为空
  repos: string[];
}
