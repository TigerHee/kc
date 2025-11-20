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

export class SyncRouteDataRoutesDto {
  @IsString()
  id: string;

  @IsString()
  path: string;

  @IsBoolean()
  ignore: boolean;

  // @IsArray()
  // @ValidateNested({ each: true })
  @ValidateIf(
    (o) => typeof o.activeBrandKeys === 'string' || Array.isArray(o.activeBrandKeys) || o.activeBrandKeys === null,
  )
  activeBrandKeys: string[];

  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  owner: string;

  @IsString()
  @IsOptional()
  url: string;

  @IsBoolean()
  @IsOptional()
  mustLogin: boolean;

  @IsOptional()
  others: any;
}

class SyncRoutesDataDto {
  @IsString()
  _id: string;

  @IsString()
  name: string;

  @IsString()
  owner: string;

  @IsString()
  url: string;

  @IsBoolean()
  deleted: boolean;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;

  @IsNumber()
  @IsOptional()
  __v: number;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => SyncRouteDataRoutesDto)
  routes: SyncRouteDataRoutesDto[];
}

export class SyncRoutesDto {
  @ValidateNested({ each: true })
  @IsNotEmpty()
  @IsArray()
  @Type(() => SyncRoutesDataDto)
  data: SyncRoutesDataDto[];
}
