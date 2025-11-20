import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CookieDiffType, CookiesListUsingPost } from '../onetrust.types';
import { convertCookieListToArr, filterNilQuery, formatOutputForJson } from '../onetrust.utils';
import { InjectModel } from '@nestjs/mongoose';
import { OnetrustCookieScan } from '../schemas/onetrust.cookies.schema';
import { Model } from 'mongoose';
import { NotificationTeamsService } from 'src/notification/services/teams.notification.service';
import { ONETRUST_HTTP_SERVICE_TOKEN } from '../onetrust.http.module';
import { NotificationLarkService } from 'src/notification/services/lark.notification.service';

@Injectable()
export class OnetrustService {
  logger = new Logger(OnetrustService.name);

  constructor(
    @InjectModel(OnetrustCookieScan.name) private onetrustCookieScanModel: Model<OnetrustCookieScan>,
    @Inject(ONETRUST_HTTP_SERVICE_TOKEN) private readonly httpService: HttpService,
    private readonly notificationTeamsService: NotificationTeamsService,
    private readonly notificationLarkService: NotificationLarkService,
  ) {
    //
  }

  /**
   * 获取所有的Cookies列表
   * https://developer.onetrust.com/onetrust/reference/getcookiereportsusingpost
   * @returns
   */
  async getCookiesList(
    query: {
      language: string;
      countryCode?: string;
      searchStr?: string;
      page?: string;
      size?: string;
    },
    domains: string[],
  ): Promise<CookiesListUsingPost> {
    const params = new URLSearchParams(filterNilQuery(query));
    try {
      const res = await this.httpService
        .post('/api/cookiemanager/v2/cookie-reports/search?' + params.toString(), {
          domains,
        })
        .toPromise();
      return res.data as CookiesListUsingPost;
    } catch {
      throw new InternalServerErrorException('获取Onetrust Cookies列表失败');
    }
  }

  /**
   * 获取当前域名的最新Cookie列表
   * @param domain
   * @returns
   */
  async getCookieLatestCookieArr(domain: string) {
    // 获取当前域名的最新Cookie列表
    const cookie = await this.onetrustCookieScanModel.findOne({ domain }).sort({ createdAt: -1 }).exec();
    return (
      cookie ?? {
        createdAt: null,
        data: [],
      }
    );
  }

  /**
   * 保存当前域名的最新Cookie列表
   * @param domain
   * @param cookies
   */
  async saveLatestCookieArr(domain: string, cookies: string[], executor: string) {
    return await new this.onetrustCookieScanModel({ domain, data: cookies, executor }).save();
  }

  /**
   * 获取当前域名的Cookie变更
   * @param current
   * @param latest
   * @returns
   */
  getCookieDiff(current: string[], latest: string[]): CookieDiffType {
    // 内容完全相等返回false
    if (current.length === latest.length && current.every((value, index) => value === latest[index])) {
      return {
        added: [],
        removed: [],
        changed: [],
      };
    }
    const added = [];
    const removed = [];
    const changed = [];

    // 找出新增和未新增的项
    latest.forEach((item) => {
      if (!current.includes(item)) {
        added.push(item);
      }
    });

    current.forEach((item) => {
      if (!latest.includes(item)) {
        removed.push(item);
      }
    });

    // 统计相同元素的变化数量
    const allItems = [...new Set([...current, ...latest])];
    allItems.forEach((item) => {
      const countIncurrent = current.filter((x) => x === item).length;
      const countInLatest = latest.filter((x) => x === item).length;
      if (countIncurrent !== countInLatest) {
        changed.push({ item: item, from: countIncurrent, to: countInLatest });
      }
    });

    return {
      added,
      removed,
      changed,
    };
  }

  /**
   * 获取当前域名的Cookie变更并发送消息
   * @param domain
   * @param conversation
   * @param mentions
   * @param verbose
   * @returns
   */
  async makeCookieDiffAAndSendMessage({ domain, conversation, mentions, verbose = false, executor }) {
    const currentCookiesList = await this.getCookiesList({ language: 'en' }, [domain]);
    const currentCookiesArr = convertCookieListToArr(currentCookiesList.content);
    const { data: latestCookiesArr, createdAt: last_latest_scan_time } = await this.getCookieLatestCookieArr(domain);
    const diff = this.getCookieDiff(latestCookiesArr, currentCookiesArr);
    await this.saveLatestCookieArr(domain, currentCookiesArr, executor);
    const base = [...new Set([...latestCookiesArr, ...currentCookiesArr])].sort();
    const data = formatOutputForJson(diff, base, {
      verbose,
    });
    const messageData = {
      data,
      last_latest_scan_time,
      domain,
      verbose,
    };
    // TODO: ---deprecated---
    await this.notificationTeamsService.sendOnetrustCookieDiffMessage(messageData, conversation, mentions);
    await this.notificationLarkService.sendCookieScanInform({
      last_scan_time: last_latest_scan_time,
      domain,
      mode: verbose ? '打开' : '关闭',
      result: diff.changed.length > 0 || diff.added.length > 0 || diff.removed.length > 0 ? '有变更' : '无变更',
      // prettier-ignore
      change_table: [
        ...(diff.added.length > 0
          ? diff.added.map((item) => ({
            item,
            type: '新增',
          }))
          : []),
        ...(diff.removed.length > 0
          ? diff.removed.map((item) => ({
            item,
            type: '删除',
          }))
          : []),
        // ...(diff.changed.length > 0
        //   ? diff.changed.map((item) => ({
        //     item: `${item.item}(${item.from} -> ${item.to})`,
        //     type: '变更',
        //   }))
        //   : []),
      ],
    });
    return messageData;
  }
}
