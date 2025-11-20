import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

class SyncReposDataDto {
  @IsString()
  repo: string;

  @IsString()
  group: string;
}

export class SyncReposDto {
  @ValidateNested({ each: true })
  @IsNotEmpty()
  @IsArray()
  @Type(() => SyncReposDataDto)
  data: SyncReposDataDto[];
}
