import { InsightTasksServices } from 'src/insight/services/tasks.insight.service';
import { Controller, Get, Post, Query } from '@nestjs/common';
import { InsightProjectsService } from './insight/services/projects.insight.service';
import { RoutesDocument } from './insight/schemas/route.schema';
import { NotificationLarkService } from './notification/services/lark.notification.service';
import { ConfigService } from '@nestjs/config';

@Controller('/')
export class AppController {
  constructor(
    private readonly insightTasksServices: InsightTasksServices,
    private readonly insightProjectsService: InsightProjectsService,
    private readonly notificationLarkService: NotificationLarkService,
    private readonly configService: ConfigService,
  ) {
    //
  }

  @Get('')
  async helloWorld() {
    // const res = await this.notificationLarkService.sendGitCommitWarning({
    //   project: 'brisk-web',
    //   branch: 'feature/SEOTP-3428',
    //   author: 'lucas.zhou@kupotech.com',
    //   standard: '任务 ID: t-grown-former 的技术方案不通过',
    //   message: 'feat(t-grown-former): converter迭代',
    //   commit_url: 'https://kufox.kcprd.com/ops/bot/apps',
    //   commit_id: '97aa9fdc5e',
    //   plan_name: '方案名称又长又臭',
    //   plan_url: 'https://open.larksuite.com/tool/cardbuilder?templateId=ctp_AARX6CN7negJ',
    //   standard_wiki: '#',
    // });
    // return res.data;
    // const res = await this.notificationLarkService.sendGitPushCodeStandardWarning({
    //   project: 'brisk-web',
    //   branch: 'feature/SEOTP-3428',
    //   author: 'lucas.zhou@kupotech.com',
    //   message: 'feat(t-grown-former): converter迭代',
    //   commit_url: 'https://kufox.kcprd.com/ops/bot/apps',
    //   commit_id: '97aa9fdc5e',
    //   plan_name: '#',
    //   plan_url: '#',
    //   issue_table: [
    //     {
    //       content: '',
    //       path: 'src/routes.config.js',
    //       standard: 'HardCode警告，新增代码 kucoin.com',
    //     },
    //   ],
    // });
    // return res.data;
    // const res = await this.notificationLarkService.sendVirusReport({
    //   vitustotal_table: [
    //     {
    //       domain: 'Kevin',
    //       malicious: "<font color='red'>23</font>",
    //       suspicious: '11',
    //     },
    //     {
    //       domain: 'Emma',
    //       malicious: "<font color='red'>34</font>",
    //       suspicious: '3',
    //     },
    //     {
    //       domain: 'Lee',
    //       malicious: "<font color='red'>453</font>",
    //       suspicious: '41',
    //     },
    //   ],
    //   malicious_count: '29',
    //   malicious_percent: "<font color='red'> 同比增加 59%</font>",
    //   suspicious_percent: "<font color='green'> 同比降低 10% ⬇</font>",
    //   suspicious_count: '25',
    // });
    // return res.data;
    // const res = await this.notificationLarkService.sendRouteUnlinkReport({
    //   route_table: [
    //     {
    //       user: '<at email=lucas.zhou@kupotech.com>@Lucas Zhou</at>',
    //       route: '/assets/fiat-currency/plaid-result',
    //     },
    //     {
    //       user: '@Lucas Zhou',
    //       route: '/assets/fiat-currency/plaid-result',
    //     },
    //     {
    //       user: '@Lucas Zhou',
    //       route: '/assets/fiat-currency/plaid-result',
    //     },
    //   ],
    // });
    // return res.data;
    // const res = await this.notificationLarkService.sendRouteNotExistReport({
    //   route_table: [
    //     {
    //       user: '<at email=lucas.zhou@kupotech.com></at>',
    //       route: 'public-web',
    //       count: '1',
    //     },
    //     {
    //       user: '<at email=lucas.zhou@kupotech.com></at>',
    //       route: 'public-web',
    //       count: '2',
    //     },
    //     {
    //       user: '<at email=lucas.zhou@kupotech.com></at>',
    //       route: 'public-web',
    //       count: '3',
    //     },
    //   ],
    // });
    // return res.data;
    // const res = await this.notificationLarkService.sendPipelineInform({
    //   coverage_table: [
    //     {
    //       type: 'lines',
    //       total: '4499',
    //       covered: '3601',
    //       percentage: '89%',
    //     },
    //     {
    //       type: 'statements',
    //       total: '4499',
    //       covered: '3601',
    //       percentage: '89%',
    //     },
    //     {
    //       type: 'functions',
    //       total: '4499',
    //       covered: '3601',
    //       percentage: '89%',
    //     },
    //     {
    //       type: 'branches',
    //       total: '4499',
    //       covered: '3601',
    //       percentage: '89%',
    //     },
    //   ],
    //   project: 'public-web',
    //   branch: 'release/2025-02-02',
    //   user: 'lucas.zhou@kupotech.com',
    //   commit_id: 'safdc21dsa',
    //   commit_url: 'https://baidu.com',
    //   pipeline_table: [
    //     {
    //       item: 'INFRA',
    //       result: '✅ 通过',
    //       reason: '无',
    //     },
    //     {
    //       item: 'E2E',
    //       result: '✅ 通过',
    //       reason: '无',
    //     },
    //     {
    //       item: 'ESLINT',
    //       result: '✅ 通过',
    //       reason: '无',
    //     },
    //     {
    //       item: 'KUXOLD',
    //       result: '✅ 通过',
    //       reason: '无',
    //     },
    //     {
    //       item: 'NEXUS',
    //       result: '✅ 通过',
    //       reason: '无',
    //     },
    //     {
    //       item: 'OWNER',
    //       result: '✅ 通过',
    //       reason: '无',
    //     },
    //     {
    //       item: 'SIZE',
    //       result: '✅ 通过',
    //       reason: '无',
    //     },
    //     {
    //       item: 'TS',
    //       result: '✅ 通过',
    //       reason: '无',
    //     },
    //     {
    //       item: 'UNITS',
    //       result: '✅ 通过',
    //       reason: '无',
    //     },
    //   ],
    // });
    // return res.data;
    // const res = await this.notificationLarkService.sendCookieScanInform({
    //   last_scan_time: '2025-10-10 10:10:00',
    //   domain: 'kucoin.tr',
    //   mode: '关闭',
    //   result: '无变更',
    //   change_table: [
    //     {
    //       item: 'X_GRAY',
    //       type: '无变更',
    //     },
    //   ],
    // });
    // return res.data;
    // const res = await this.notificationLarkService.sendNewFeatureInform({
    //   manuals_url: 'https://kufox.kcprd.com/ops/bot/apps',
    //   feature_url: 'https://google.com',
    //   feature:
    //     '**🌟 多端定制：满足不同终端的使用体验**\n定制工作台提供了电脑端、移动端、iPad 端多端定制能力，更好地满足不同场景、不同设备的使用诉求，体验远超竞品。\n**🌟 多端定制：满足不同终端的使用体验**\n定制工作台提供了电脑端、移动端、iPad 端多端定制能力，更好地满足不同场景、不同设备的使用诉求，体验远超竞品。\n**🌟 多端定制：满足不同终端的使用体验**\n定制工作台提供了电脑端、移动端、iPad 端多端定制能力，更好地满足不同场景、不同设备的使用诉求，体验远超竞品。',
    // });
    // return res.data;
    // const res = await this.notificationLarkService.sendShutDownInform({
    //   content:
    //     '**🌟 多端定制：满足不同终端的使用体验**\n定制工作台提供了电脑端、移动端、iPad 端多端定制能力，更好地满足不同场景、不同设备的使用诉求，体验远超竞品。\n**🌟 多端定制：满足不同终端的使用体验**\n定制工作台提供了电脑端、移动端、iPad 端多端定制能力，更好地满足不同场景、不同设备的使用诉求，体验远超竞品。\n**🌟 多端定制：满足不同终端的使用体验**\n定制工作台提供了电脑端、移动端、iPad 端多端定制能力，更好地满足不同场景、不同设备的使用诉求，体验远超竞品。',
    //   start: '2025-10-11 10:10:00',
    //   finish: '2025-10-11 10:10:00',
    // });
    // return res.data;
    // return 'Hello World!';
  }

  @Get('health')
  async health() {
    return 'OK';
  }

  /**
   * @deprecated
   * kc-web-checker
   */
  @Post('stats')
  async stats() {
    return true;
  }

  /**
   * @deprecated
   * kc-web-checker
   */
  @Get('tasks')
  async task(@Query('taskId') taskId: string) {
    const res = [];
    const data = await this.insightTasksServices.findOneByJobId(taskId);
    res.push({
      status: data?.wiki?.status ?? false,
    });
    return res;
  }

  /**
   * @deprecated
   * page-speed
   */
  @Get('projects')
  async projects() {
    const data = await this.insightProjectsService.gatherRoute({
      current: 1,
      pageSize: 1000,
      route: null,
      owner: null,
      createdAt: null,
      updatedAt: null,
    });
    return data.list.map((project) => {
      return {
        id: project.id,
        name: project.name,
        owner: project.owner?.email ?? '',
        url: project.accessibleLink,
        routes: project.routes.map((route: RoutesDocument) => {
          const _route = {
            id: route._id,
            path: route.path,
            ignore: route.isIgnore,
            title: route.title,
            owner: route.originalOwner,
            url: route.accessibleLink,
            others: route.competitor,
            activeBrandKeys: route.tenant,
            createdAt: route.createdAt,
            mustLogin: route.isNeedLogin,
            updatedAt: route.updatedAt,
          };
          if ((route.competitor as unknown as string) === '') {
            _route.others = {};
          } else {
            _route.others = JSON.parse(route.competitor as unknown as string);
          }
          return _route;
        }),
        deleted: false,
        createdAt: project.createdAt,
        __v: project.__v,
        updatedAt: project.updatedAt,
      };
    });
  }
}
