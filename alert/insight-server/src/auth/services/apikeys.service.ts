import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiKeys, ApiKeysDocument } from '../schemas/apikeys.schema';
import { Model } from 'mongoose';

@Injectable()
export class ApiKeysService {
  constructor(@InjectModel(ApiKeys.name) private apikeysModel: Model<ApiKeysDocument>) {
    //
  }

  /**
   * 列表数据
   * @returns
   */
  async list(): Promise<ApiKeysDocument[]> {
    const res = await this.apikeysModel
      .find()
      .populate('owner')
      .sort({
        createdAt: -1,
      })
      .exec();

    return res;
  }

  /**
   * 查询一条密钥
   * @param query
   * @returns
   */
  async findOne(query: { remark: string }): Promise<ApiKeysDocument> {
    return this.apikeysModel.findOne(query).exec();
  }

  /**
   * 创建一条密钥
   * @param data
   * @returns
   */
  async createOne(data: { secret: string; remark: string; duration: number; owner: string }): Promise<ApiKeysDocument> {
    return this.apikeysModel.create(data);
  }

  /**
   * 删除一条密钥
   * @param query
   * @returns
   */
  async deleteOne(id): Promise<ApiKeysDocument> {
    return this.apikeysModel.findByIdAndDelete(id).exec();
  }

  /**
   * 禁用一条密钥
   * @param query
   * @returns
   */
  async disabledOne(id): Promise<ApiKeysDocument> {
    return this.apikeysModel.findByIdAndUpdate(id, { status: 0 }).exec();
  }

  /**
   * 更新最后使用时间
   * @param id
   * @returns
   */
  async updateLastUsedAt(id: string) {
    return this.apikeysModel.findByIdAndUpdate(id, { lastUsedAt: new Date() }).exec();
  }
}
