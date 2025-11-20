import { IsArray, IsString } from 'class-validator';

export class TeamsSendUserMessageDto {
  /**
   * 任务名称
   */
  @IsString()
  readonly text: string;

  /**
   * 任务数据
   */
  @IsArray()
  readonly users: string[];
}
