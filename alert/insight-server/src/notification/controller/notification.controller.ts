import { Body, Controller, Get, Param, Post, ValidationPipe } from '@nestjs/common';
import { NotificationTeamsService } from '../services/teams.notification.service';
import { TeamsSendUserMessageDto } from '../dto/teams-send-user-message.dto';
import { TeamsSendConversationMessageDto } from '../dto/teams-send-conversation-message.dto';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationTeamsService: NotificationTeamsService) {
    //
  }

  @Post('teams/send/conversation')
  async sendConversationMessage(@Body(new ValidationPipe()) body: TeamsSendConversationMessageDto) {
    const { text, conversation } = body;
    const res = await this.notificationTeamsService.sendMessageToConversation(text, conversation);
    return res.data;
  }

  @Post('teams/send/user')
  async sendUserMessage(@Body(new ValidationPipe()) body: TeamsSendUserMessageDto) {
    const { text, users } = body;
    const res = await this.notificationTeamsService.sendMessageToUser(text, users);
    return res.data;
  }

  @Get('teams/check/push-id/:id')
  async check(@Param('id') id: string) {
    const res = await this.notificationTeamsService.checkPushIdStatus(id);
    return res.data;
  }

  @Get('teams/check/email/:email')
  async checkEmail(@Param('email') email: string) {
    const res = await this.notificationTeamsService.checkEmailStatus(email);
    return res.data;
  }
}
