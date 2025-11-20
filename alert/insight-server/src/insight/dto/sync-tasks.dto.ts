import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

class ErrorsDto {
  @IsString()
  title: string;

  @ValidateIf((o) => typeof o.content === 'string' || Array.isArray(o.content))
  content: string | string[];
}

class SyncTaskDataOwnerDto {
  @IsString()
  email: string;

  @IsString()
  displayName: string;
}

class SyncTaskPrAndPushDto {
  @IsBoolean()
  status: boolean;

  @IsString()
  @IsOptional()
  eventKey: string;

  @IsString()
  @IsOptional()
  slug: string;

  @IsString()
  branch: string;

  @IsString()
  message: string;

  @IsString()
  commitId: string;

  @IsString()
  commitUrl: string;

  @IsString()
  @IsOptional()
  author: string;

  @IsString()
  @IsOptional()
  warnText: string;

  @IsNumber()
  @IsOptional()
  prId: number;

  @IsString()
  @IsOptional()
  prUrl: string;

  @IsString()
  @IsOptional()
  prSlug: string;
}

class SyncTaskWikiFormatDto {
  @IsBoolean()
  status: boolean;

  @IsOptional()
  @Type(() => ErrorsDto)
  @ValidateNested()
  errors: ErrorsDto[];
}

class SyncTaskDataDto {
  @IsString()
  @IsNotEmpty()
  _id: string;

  @IsString()
  @IsNotEmpty()
  taskId: string;

  @IsString()
  @IsNotEmpty()
  taskName: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => SyncTaskDataOwnerDto)
  owner: SyncTaskDataOwnerDto;

  @IsBoolean()
  status: boolean;

  @IsNumber()
  wikiPageId: number;

  @IsString()
  wikiUrl: string;

  @IsString()
  wikiTitle: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => SyncTaskWikiFormatDto)
  wikiFormat: SyncTaskWikiFormatDto;

  @IsArray()
  @IsString({ each: true })
  author: string[];

  @ValidateNested()
  @IsOptional()
  @Type(() => SyncTaskPrAndPushDto)
  push: SyncTaskPrAndPushDto;

  @ValidateNested()
  @IsOptional()
  @Type(() => SyncTaskPrAndPushDto)
  pr: SyncTaskPrAndPushDto;

  @IsOptional()
  @IsString()
  createdAt: string;

  @IsOptional()
  @IsString()
  updatedAt: string;

  @IsNumber()
  @IsOptional()
  __v: number;

  @IsNumber()
  @IsOptional()
  prId: number;

  @IsString()
  @IsOptional()
  prSlug: string;
}

export class SyncTasksDto {
  @ValidateNested({ each: true })
  @IsNotEmpty()
  @IsArray()
  @Type(() => SyncTaskDataDto)
  data: SyncTaskDataDto[];
}
