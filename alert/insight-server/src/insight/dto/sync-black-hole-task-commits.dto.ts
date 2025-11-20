import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';

class SyncBlackHoleTaskCommitsDataTto {
  @IsString()
  _id: string;

  @IsString()
  taskId: string;

  @IsString()
  slug: string;

  @IsString()
  commitId: string;

  @IsString()
  commitUrl: string;

  @IsString()
  author: string;

  @IsString()
  branch: string;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;

  @IsNumber()
  __v: number;
}

export class SyncBlackHoleTaskCommitsDto {
  @ValidateNested({ each: true })
  @IsNotEmpty()
  @IsArray()
  @Type(() => SyncBlackHoleTaskCommitsDataTto)
  data: SyncBlackHoleTaskCommitsDataTto[];
}
