import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BreakdownAnnouncement, BreakdownAnnouncementDocument } from './schemas/breakdown-announcement.schema';
import { Model, Types } from 'mongoose';
import { FeatureAnnouncement, FeatureAnnouncementDocument } from './schemas/feature-announcement.schema';
import { NotificationLarkService } from 'src/notification/services/lark.notification.service';
import { RequestUserInfo } from 'src/auth/auth.types';
import { wrapperLarkAppInterOpenLink } from 'src/lark/utils';

@Injectable()
export class AnnouncementService {
  constructor(
    @InjectModel(BreakdownAnnouncement.name)
    private readonly breakdownAnnouncementModel: Model<BreakdownAnnouncementDocument>,
    @InjectModel(FeatureAnnouncement.name)
    private readonly featureAnnouncementModel: Model<FeatureAnnouncementDocument>,
    private readonly notificationLarkService: NotificationLarkService,
  ) {
    //
  }

  async breakdownList(params: { current?: number; pageSize?: number }) {
    const { current = 1, pageSize = 10 } = params;

    const list = await this.breakdownAnnouncementModel
      .find()
      .populate('user')
      .sort({ createdAt: -1 })
      .skip((current - 1) * pageSize)
      .limit(pageSize);

    const total = await this.breakdownAnnouncementModel.countDocuments();
    return {
      list,
      total,
    };
  }

  async featureList(params: { current?: number; pageSize?: number }) {
    const { current = 1, pageSize = 10 } = params;

    const list = await this.featureAnnouncementModel
      .find()
      .populate('user')
      .sort({ createdAt: -1 })
      .skip((current - 1) * pageSize)
      .limit(pageSize);

    const total = await this.featureAnnouncementModel.countDocuments();
    return {
      list,
      total,
    };
  }

  async publishBreakdownAnnouncement(data: BreakdownAnnouncement, user: RequestUserInfo) {
    const { startAt, finishAt, content } = data;
    // const _user = await this.userService.getUserByEmail(user.email);
    const res = await this.breakdownAnnouncementModel.create({
      user: new Types.ObjectId(user.id),
      startAt,
      finishAt,
      content,
    });
    // 发送通知
    this.notificationLarkService.sendShutDownInform({
      start: startAt,
      finish: finishAt,
      content,
    });
    return res;
  }

  /**
   * 发布新功能公告
   */
  async publishFeatureAnnouncement(data: FeatureAnnouncement, user: RequestUserInfo) {
    const { manualsUrl, featureUrl, feature } = data;
    // const _user = await this.userService.getUserByEmail(user.email);
    const res = await this.featureAnnouncementModel.create({
      user: new Types.ObjectId(user.id),
      manualsUrl,
      featureUrl,
      feature,
    });
    // 发送通知
    this.notificationLarkService.sendNewFeatureInform({
      manuals_url: manualsUrl,
      feature_url: wrapperLarkAppInterOpenLink(featureUrl),
      feature,
    });
    return res;
  }

  /**
   * 删除公告
   * @param id
   * @returns
   */
  async deleteFeatureAnnouncement(id: string) {
    const res = await this.featureAnnouncementModel.findByIdAndDelete(id);
    if (!res) {
      throw new Error('公告不存在');
    }
    return res;
  }
}
