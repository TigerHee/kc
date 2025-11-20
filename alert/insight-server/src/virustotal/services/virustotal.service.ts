import { Inject, Injectable, Logger } from '@nestjs/common';
import { VIRUSTOTAL_HTTP_SERVICE_TOKEN } from '../virustotal.http.module';
import { KUCOIN_URLS_TO_CHECK } from 'src/safebrowsing/constants/safebrowsing.constants';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VirustotalScan } from '../schemas/virustotal.schema';
import { NotificationTeamsService } from 'src/notification/services/teams.notification.service';
import { ConfigService } from '@nestjs/config';
import { NotificationLarkService } from 'src/notification/services/lark.notification.service';

@Injectable()
export class VirustotalService {
  logger = new Logger(VirustotalService.name);
  constructor(
    @Inject(VIRUSTOTAL_HTTP_SERVICE_TOKEN) private readonly virustotalHttpService,
    @InjectModel(VirustotalScan.name) private virustotalScanModel: Model<VirustotalScan>,
    private readonly notificationTeamsService: NotificationTeamsService,
    private readonly notificationLarkService: NotificationLarkService,
    private readonly configService: ConfigService,
  ) {
    //
  }
  private readonly batchSize = 4; // 每分钟处理 4 个域名
  /**
   * 检查域名
   * @param domain
   * @returns
   */
  async checkDomain(domain: string) {
    try {
      const { data } = await this.virustotalHttpService.get(`/api/v3/domains/${domain}`).toPromise();
      return data;
    } catch (error) {
      this.logger.error(`virustotal api ${domain}:`, error);
      return null;
    }
  }

  // 4/min => 一分钟查4个，间隔15s
  // 500/day => 建议一天跑4次
  async checkKucoinDomains(executor: string) {
    const isDevelopment = this.configService.get<string>('NODE_ENV') === 'development';
    //只有立即执行任务开发环境可以直接执行
    if (isDevelopment && executor === 'system') {
      return;
    }
    const domains = []; // 用于存储所有结果

    try {
      for (let i = 0; i < KUCOIN_URLS_TO_CHECK.length; i += this.batchSize) {
        const batch = KUCOIN_URLS_TO_CHECK.slice(i, i + this.batchSize);
        this.logger.log(`virustotal processing batch:`, batch);

        try {
          const result = await Promise.all(
            batch.map(async (domain) => {
              try {
                const { data } = await this.checkDomain(domain); // 获取 checkDomain 的返回值
                if (data && data.attributes) {
                  const { attributes, ...other } = data;
                  const { last_analysis_stats, last_analysis_results } = attributes;
                  const { malicious, suspicious } = last_analysis_stats;

                  const analysisResults = [];
                  if (malicious > 0 || suspicious > 0) {
                    Object.keys(last_analysis_results).forEach((vendor) => {
                      const item = last_analysis_results[vendor];
                      if (item.category === 'malicious' || item.category === 'suspicious') {
                        analysisResults.push(item);
                      }
                    });
                    return { malicious, suspicious, analysisResults, ...other };
                  }
                }
                return null; // 确保返回 null 而不是 undefined
              } catch (error) {
                this.logger.error(`Error virustotal checking domain ${domain}`, error);
                return null; // 捕获单个域名的异常，继续其他域名的处理
              }
            }),
          );
          domains.push(...result.filter(Boolean)); // 过滤掉 null 或 undefined 的结果
        } catch (batchError) {
          this.logger.error(`Error processing batch: ${batch}`, batchError); // 捕获当前批次的异常，继续处理后续批次
        }

        // 等待 15 秒后处理下一批
        if (i + this.batchSize < KUCOIN_URLS_TO_CHECK.length) {
          await new Promise((resolve) => setTimeout(resolve, 15 * 1000));
        }
      }

      // 过滤掉没有 `id` 的域名
      const validDomains = domains.filter((domain) => domain && domain.id);
      if (validDomains.length === 0) {
        this.logger.warn('No domains to save or update.');
        return;
      }

      this.saveLatestKucoinDomains(validDomains, executor);

      const exceptDomains = validDomains.filter((item) => item.malicious > 0 || item.suspicious > 0);
      console.log('exceptDomains', exceptDomains);

      // TODO: ---deprecated---
      await this.notificationTeamsService.sendVirustotalReport(exceptDomains);

      const { latest_malicious_count, latest_suspicious_count } = await this.getLatestReportAnalysis();
      const current_malicious_count = exceptDomains.reduce((acc, item) => acc + item.malicious, 0);
      const current_suspicious_count = exceptDomains.reduce((acc, item) => acc + item.suspicious, 0);
      let malicious_percent = '0%';
      let suspicious_percent = '0%';
      let malicious_subtraction = 0;
      let suspicious_subtraction = 0;
      if (latest_malicious_count !== 0) {
        malicious_subtraction = current_malicious_count - latest_malicious_count;
        malicious_percent = ((malicious_subtraction / latest_malicious_count) * 100).toFixed(2) + '%';
      }
      if (latest_suspicious_count !== 0) {
        suspicious_subtraction = current_suspicious_count - latest_suspicious_count;
        suspicious_percent = ((suspicious_subtraction / latest_suspicious_count) * 100).toFixed(2) + '%';
      }
      await this.notificationLarkService.sendVirustotalReport({
        vitustotal_table: exceptDomains.map((item) => ({
          domain: item.id,
          malicious: item.malicious,
          suspicious: item.suspicious,
        })),
        malicious_count: current_malicious_count,
        suspicious_count: current_suspicious_count,
        malicious_percent: this.wrapperPercentNumber(malicious_subtraction, malicious_percent),
        suspicious_percent: this.wrapperPercentNumber(suspicious_subtraction, suspicious_percent),
      });
    } catch (error) {
      this.logger.error('Critical error in checkKuDomains:', error);
    }
  }

  /**
   * 封装百分比
   * @param symbols
   * @param percent
   * @returns
   */
  private wrapperPercentNumber(symbols: number, percent: string) {
    if (symbols > 0) {
      return `<font color="red"> ${percent} </font>`;
    }
    if (symbols === 0) {
      return `<font color="grey"> ${percent} </font>`;
    }
    return `<font color="green"> ${percent} </font>`;
  }

  /**
   * 保存kc域名列表
   * @param domain
   * @param executor
   */
  async saveLatestKucoinDomains(domains, executor: string) {
    try {
      // 构建批量操作
      const bulkOperations = domains.map((domain) => ({
        updateOne: {
          filter: { id: domain.id }, // 根据 `id` 查找
          update: {
            $set: {
              ...domain,
              executor,
              updatedAt: new Date(), // 更新时间
            },
            $setOnInsert: {
              createdAt: new Date(), // 插入时设置创建时间
            },
          },
          upsert: true, // 如果不存在则插入
        },
      }));

      const result = await this.virustotalScanModel.bulkWrite(bulkOperations);
      this.logger.log(`Bulk operation completed: ${result.modifiedCount} updated, ${result.upsertedCount} inserted.`);
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
    id,
    executor,
  }: {
    current?: number;
    pageSize?: number;
    id?: string;
    executor?: string;
  }) {
    const query = {};
    if (id) {
      query['id'] = { $regex: id, $options: 'i' };
    }
    if (executor) {
      query['executor'] = executor;
    }

    const data = await this.virustotalScanModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip((current - 1) * pageSize)
      .limit(pageSize)
      .exec();
    const total = await this.virustotalScanModel.countDocuments(query);
    return {
      list: data,
      total,
    };
  }

  /**
   * 获取最新的报告分析
   * @returns
   */
  async getLatestReportAnalysis(): Promise<{ latest_malicious_count: number; latest_suspicious_count: number }> {
    const data = await this.virustotalScanModel.find().sort({ createdAt: -1 }).exec();
    const validData = data.filter((domain) => domain && domain.id);

    if (validData && validData.length > 0) {
      return {
        latest_malicious_count: validData.reduce((acc, item) => acc + item.malicious, 0),
        latest_suspicious_count: validData.reduce((acc, item) => acc + item.suspicious, 0),
      };
    }
    return {
      latest_malicious_count: 0,
      latest_suspicious_count: 0,
    };
  }
}
