import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SystemMessage, SystemMessageDocument } from '../schemas/system-message.schema';
import { Model } from 'mongoose';
import { AppGateway, WsEventTypes } from 'src/websocket/app.gateway';
import { UserService } from 'src/auth/services/user.service';

@Injectable()
export class SystemNotificationService {
  constructor(
    @InjectModel(SystemMessage.name) private systemMessageModel: Model<SystemMessageDocument>,
    private readonly userService: UserService,
    private readonly appGateway: AppGateway,
  ) {
    //
  }
  /**
   * 获取系统通知列表
   * @param param
   * @returns
   */
  async getSystemNotificationList(params: { current?: number; pageSize?: number; sendTo: string }) {
    const { current = 1, pageSize = 10, sendTo } = params;
    const query = { sendTo };
    const list = await this.systemMessageModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip((current - 1) * pageSize)
      .limit(pageSize)
      .exec();
    const total = await this.systemMessageModel.countDocuments(query).exec();
    return {
      list,
      total,
    };
  }

  /**
   * 添加系统通知
   * @param data
   * @returns
   */
  async addSystemNotification(data: SystemMessageDocument) {
    const res = await new this.systemMessageModel(data).save();
    const user = await this.userService.getUserById(data.sendTo as unknown as string);
    this.appGateway.sendToUserMessage(user.email, WsEventTypes.SYSTEM_NOTIFICATION, data);
    return res;
  }

  /**
   * 获取系统通知数量
   */
  async getSystemNotificationUnreadCount({ sendTo }: { sendTo: string }) {
    const unread = await this.systemMessageModel.countDocuments({ readStatus: false, sendTo }).exec();
    return unread;
  }

  /**
   * 标记系统通知为已读
   */
  async readSystemNotification(id: string) {
    return await this.systemMessageModel.updateOne({ _id: id }, { readStatus: true }).exec();
  }
}
