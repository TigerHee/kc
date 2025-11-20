import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AlarmMessage, AlarmMessageDocument } from '../schemas/alarm-message.schema';
import { AppGateway, WsEventTypes } from 'src/websocket/app.gateway';
import { UserService } from 'src/auth/services/user.service';
import { Model, Types } from 'mongoose';
import { WebhookInfoType } from 'src/bitbucket/types/webhook.types';

@Injectable()
export class AlarmNotificationService {
  constructor(
    @InjectModel(AlarmMessage.name) private alarmMessageModel: Model<AlarmMessageDocument>,
    private readonly appGateway: AppGateway,
    private readonly userService: UserService,
  ) {
    //
  }

  /**
   * 获取自己的告警通知列表
   */
  async getAlarmNotificationList(params: { current?: number; pageSize?: number; author: string }) {
    const { current = 1, pageSize = 10, author } = params;
    const query = {
      author: new Types.ObjectId(author),
    };
    const list = await this.alarmMessageModel
      .find(query)
      .populate('author')
      .sort({ createdAt: -1 })
      .skip((current - 1) * pageSize)
      .limit(pageSize)
      .exec();
    const total = await this.alarmMessageModel.countDocuments(query).exec();
    return {
      list,
      total,
    };
  }

  /**
   * 获取告警通知列表
   * @param params
   * @returns
   */
  async getAlarmNotificationListForAdmin(params: { current?: number; pageSize?: number }) {
    const { current = 1, pageSize = 10 } = params;
    const query = {};
    const list = await this.alarmMessageModel
      .find(query)
      .populate('author')
      .sort({ createdAt: -1 })
      .skip((current - 1) * pageSize)
      .limit(pageSize)
      .exec();
    const total = await this.alarmMessageModel.countDocuments(query);
    return {
      list,
      total,
    };
  }

  /**
   * 添加告警通知
   * @param data
   * @returns
   */
  async addAlarmNotification(data: Partial<WebhookInfoType>) {
    const res = await new this.alarmMessageModel({
      ...data,
      author: data.user?._id,
      authorOriginal: data.authorEmail,
    }).save();
    this.appGateway.sendToUserMessage(data.authorEmail, WsEventTypes.ALARM_NOTIFICATION, data);
    return res;
  }

  /**
   * 获取未读告警通知数量
   */
  async getAlarmNotificationUnreadCount({ author }: { author: string }) {
    const unread = await this.alarmMessageModel.countDocuments({ readStatus: false, author }).exec();
    return unread;
  }

  /**
   * 标记告警通知为已读
   */
  async readAlarmNotification(id: string) {
    return await this.alarmMessageModel.updateOne({ _id: id }, { readStatus: true }).exec();
  }
}
