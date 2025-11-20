import { IsString, IsOptional, IsBoolean, IsIn } from 'class-validator';

export class ChangeAlertStatusDto {
  @IsString()
  _id: string;

  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  remark?: string;
}

export class ChangeAlertDataDto {
  @IsString()
  _id: string;

  @IsIn(['view', 'finish'])
  type: 'view' | 'finish';

  @IsOptional()
  @IsBoolean()
  isReset?: boolean;
}
