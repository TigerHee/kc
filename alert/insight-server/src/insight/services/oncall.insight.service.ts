import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OnCall, OnCallDocument } from '../schemas/oncall.schema';
import { Model } from 'mongoose';

@Injectable()
export class InsightOncallService {
  constructor(@InjectModel(OnCall.name) private oncallModel: Model<OnCallDocument>) {
    //
  }

  /**
   * 列表数据
   */
  async list() {
    return this.oncallModel
      .find()
      .populate('groupUsers')
      .populate('currentUser')
      .populate('relatedRepos')
      .sort({
        createdAt: -1,
      })
      .exec();
  }

  /**
   * 更新数据
   */
  async update(id: string, data: OnCallDocument) {
    return this.oncallModel
      .findByIdAndUpdate(id, {
        ...data,
        updatedAt: new Date(),
      })
      .exec();
  }

  /**
   * 创建数据
   */
  async create(data: OnCallDocument) {
    return this.oncallModel.create(data);
  }
}
