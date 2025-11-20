import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OnetrustCookieScan } from '../schemas/onetrust.cookies.schema';
import { Model } from 'mongoose';

@Injectable()
export class OnetrustReportService {
  constructor(@InjectModel(OnetrustCookieScan.name) private onetrustCookieScanModel: Model<OnetrustCookieScan>) {
    //
  }

  /**
   * 获取所有的Cookies列表
   * @returns
   */
  async getReportList({
    current = 1,
    pageSize = 10,
    domain,
    executor,
  }: {
    current?: number;
    pageSize?: number;
    domain?: string;
    executor?: string;
  }) {
    const query = {};
    if (domain) {
      query['domain'] = domain;
    }
    if (executor) {
      query['executor'] = executor;
    }
    const data = await this.onetrustCookieScanModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip((current - 1) * pageSize)
      .limit(pageSize)
      .exec();
    const total = await this.onetrustCookieScanModel.countDocuments(query);
    return {
      list: data,
      total,
    };
  }
}
