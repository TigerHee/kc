import { Inject, Injectable, Logger } from '@nestjs/common';
import { SAFE_BROWSING_SERVICE_TOKEN } from '../safebrowsing.http.module';
import { KUCOIN_URLS_TO_CHECK } from '../constants/safebrowsing.constants';
import { InjectModel } from '@nestjs/mongoose';
import { SafebrowsingScan } from '../schemas/safebrowsing.schema';
import { Model } from 'mongoose';
import { NotificationTeamsService } from 'src/notification/services/teams.notification.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SafebrowsingService {
  logger = new Logger(SafebrowsingService.name);
  constructor(
    @Inject(SAFE_BROWSING_SERVICE_TOKEN) private readonly safebrowsingHttpService,
    @InjectModel(SafebrowsingScan.name) private safebrowsingScanModel: Model<SafebrowsingScan>,
    private readonly notificationTeamsService: NotificationTeamsService,
    private readonly configService: ConfigService,
  ) {
    //
  }

  /**
   * 检查url
   * @param urls
   * @returns
   */
  async checkUrls(urls: string[]): Promise<[]> {
    try {
      const requestBody = {
        client: {
          clientId: 'vitace-client-01', // 你的客户端 ID
          clientVersion: '1.0', // 你的客户端版本
        },
        threatInfo: {
          threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE'],
          platformTypes: ['ANY_PLATFORM'],
          threatEntryTypes: ['URL'],
          threatEntries: urls.map((url) => ({ url })),
        },
      };
      const response = await this.safebrowsingHttpService
        .post(`/v4/threatMatches:find?key=${this.configService.get<string>('SAFE_BROWSING_API_KEY')}`, requestBody)
        .toPromise();
      return response.data.matches || [];
    } catch (error) {
      console.error('Error checking Safe Browsing URLs:', error);
      throw error;
    }
  }

  async checkKucoinUrls(executor: string) {
    const domains = await this.checkUrls(KUCOIN_URLS_TO_CHECK);
    if (domains.length === 0) {
      this.logger.warn('No domains to save.');
      return;
    }
    await this.notificationTeamsService.sendSafebrowsingReport(domains);
    return this.saveKucoinSafebrowsingDomains(domains, executor);
  }
  /**
   * 保存kc域名列表
   * @param domain
   * @param executor
   */
  async saveKucoinSafebrowsingDomains(domains, executor: string) {
    // 将域名数据映射为批量插入的数据格式
    const bulkData = domains.map((domain) => ({
      ...domain,
      executor,
      createdAt: new Date(),
    }));

    try {
      await this.safebrowsingScanModel.insertMany(bulkData);
      this.logger.log(`Successfully saved ${bulkData.length} domain records.`);
    } catch (error) {
      this.logger.error('Error while saving domain records:', error);
    }
  }

  /**
   * 获取所有的域名列表
   * @returns
   */
  async getReportDomains({
    current = 1,
    pageSize = 10,
    domain,
    threatType,
    platformType,
    executor,
  }: {
    current?: number;
    pageSize?: number;
    domain?: string;
    threatType?: string;
    platformType?: string;
    executor?: string;
  }) {
    const query = {};
    if (domain) {
      query['threat.url'] = { $regex: domain, $options: 'i' };
    }
    if (executor) {
      query['executor'] = executor;
    }
    if (threatType) {
      query['threatType'] = threatType;
    }
    if (platformType) {
      query['platformType'] = platformType;
    }
    const data = await this.safebrowsingScanModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip((current - 1) * pageSize)
      .limit(pageSize)
      .exec();
    const total = await this.safebrowsingScanModel.countDocuments(query);
    return {
      list: data,
      total,
    };
  }
}
