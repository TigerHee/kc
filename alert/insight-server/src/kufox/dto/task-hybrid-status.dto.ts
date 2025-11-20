import { IsArray, IsString } from 'class-validator';

export class TaskHybridStatusDto {
  @IsArray()
  @IsString({ each: true })
  wikis: string[];
}
