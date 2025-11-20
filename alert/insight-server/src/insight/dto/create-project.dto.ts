import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateProjectSchedule {
  [key: string]: string;
}

export class CreateProjectDto {
  @IsString()
  @IsOptional()
  accessibleLink: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsNotEmpty()
  owner: string;

  @IsString()
  @IsNotEmpty()
  repos: string;

  @IsObject()
  @IsOptional()
  @Type(() => CreateProjectSchedule)
  schedule: CreateProjectSchedule;

  @IsArray()
  @IsOptional()
  @Type(() => String)
  workflow: Array<string>;
}
