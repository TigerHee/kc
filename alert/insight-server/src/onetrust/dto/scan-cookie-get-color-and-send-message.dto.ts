import { IsArray, IsBoolean, IsString } from 'class-validator';

export class ScanCookieGetColorAndSendMessageDto {
  @IsString()
  readonly conversation: string;

  @IsArray()
  readonly mentions: string[];

  @IsBoolean()
  readonly verbose: boolean;
}
