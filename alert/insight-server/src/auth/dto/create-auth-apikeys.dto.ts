import { IsEnum, IsNotEmpty, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';
import { AuthRoleEnum } from '../constants/user.constant';
import { Type } from 'class-transformer';

export class ApiKeysData {
  @IsEnum(AuthRoleEnum)
  @IsNotEmpty()
  role: AuthRoleEnum;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  remark: string;
}

export class CreateAuthApiKeysDto {
  @IsString()
  readonly remark: string;

  @IsObject()
  @ValidateNested({ each: true })
  @IsNotEmpty()
  @Type(() => ApiKeysData)
  readonly data: ApiKeysData;

  @IsNumber()
  readonly duration: number;
}
