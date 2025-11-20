import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

class UserDto {
  @IsString()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly displayName: string;

  @IsString()
  @IsOptional()
  readonly phone: string;
}

class SyncDataDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly _id: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => UserDto)
  readonly user: UserDto;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  readonly roles: string[];

  @IsString()
  @IsOptional()
  readonly createdAt: string;

  @IsString()
  @IsOptional()
  readonly updatedAt: string;

  @IsNumber()
  @IsOptional()
  readonly __v: number;
}

export class SyncUserDto {
  @ValidateNested({ each: true })
  @IsNotEmpty()
  @IsArray()
  @Type(() => SyncDataDto)
  data: SyncDataDto[];
}
