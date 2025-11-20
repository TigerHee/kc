import { IsString } from 'class-validator';

export class TeamsSendConversationMessageDto {
  /**
   * 任务名称
   */
  @IsString()
  readonly text: string;

  /**
   * 任务数据
   */
  @IsString()
  readonly conversation: string;
}
