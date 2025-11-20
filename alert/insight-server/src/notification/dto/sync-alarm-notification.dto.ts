import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';

class SyncAlarmNotificationDataDto {
  @IsString()
  _id: string;

  @IsString()
  eventKey: string;

  @IsBoolean()
  status: boolean;

  @IsString()
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
  author: string;

  @IsString()
  warnText: string;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;

  @IsNumber()
  __v: number;
}

export class SyncAlarmNotificationDto {
  @ValidateNested({ each: true })
  @IsNotEmpty()
  @IsArray()
  @Type(() => SyncAlarmNotificationDataDto)
  data: SyncAlarmNotificationDataDto[];
}
