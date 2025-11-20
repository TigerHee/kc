import { Inject, Injectable } from '@nestjs/common';
import { LARK_HTTP_SERVICE_TOKEN } from '../lark.http.module';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { LarkApiSendResponse, LarkInteractiveMessage, LarkMessage } from '../types/lark.types';
import {
  GitSubmitWarningTemplate,
  GitSubmitWarningTemplateValueType,
} from '../templates/lark/GitSubmitWarningTemplate';
import {
  VirustotalMaliciousScanReportTemplate,
  VirustotalMaliciousScanReportTemplateValueType,
} from '../templates/lark/VirustotalMaliciousScanReportTemplate';
import {
  RouteUnlinkScanReportTemplate,
  RouteUnlinkScanReportTemplateValueType,
} from '../templates/lark/RouteUnlinkScanReportTemplate';
import {
  RouteNotExistWarningTemplate,
  RouteNotExistWarningTemplateValueType,
} from '../templates/lark/RouteNotExistWarningTemplate';
import {
  PipelineResultInformTemplate,
  PipelineResultInformTemplateValueType,
} from '../templates/lark/PipelineResultInformTemplate';
import {
  CookieChangeReportTemplate,
  CookieChangeReportTemplateValueType,
} from '../templates/lark/CookieChangeReportTemplate';
import {
  NewFeatureInformTemplate,
  NewFeatureInformTemplateValueType,
} from '../templates/lark/NewFeatureInformTemplate';
import {
  ShutdownUpdateInformTemplate,
  ShutdownUpdateInformTemplateValueType,
} from '../templates/lark/ShutdownUpdateInformTemplate';
import {
  GitPushCodeStandardWarningTemplate,
  GitPushCodeStandardWarningTemplateValueType,
} from '../templates/lark/GitPushCodeStandardWarningTemplate';
import { KunlunLogger } from 'src/common/kunlun.logger';
import {
  ComplianceCodeWarningTemplate,
  ComplianceCodeWarningTemplateValueType,
} from '../templates/lark/ComplianceCodeWarningTemplate';
import {
  SendAlertBacklogMessageTemplate,
  SendAlertBacklogMessageTemplateValueType,
} from '../templates/lark/SendAlertBacklogMessageTemplate';

/**
 * https://open.larksuite.com/tool/cardbuilder
 */
@Injectable()
export class NotificationLarkService {
  logger = new KunlunLogger(NotificationLarkService.name);
  path = '/api/lark/notify';
  group: {
    /**
     * 代码规范群
     */
    CODE_STANDARD: string;
    /**
     * 流水线通知群
     */
    PIPELINE_INFORM: string;
    /**
     * Cookie扫描通知群
     */
    COOKIE_SCAN_INFORM: string;
    /**
     * Insight消息群
     */
    INSIGHT_INFORM: string;
    /**
     * 告警统计消息群
     */
    ALERT: string;
  };
  constructor(
    @Inject(LARK_HTTP_SERVICE_TOKEN) private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    //
    this.group = {
      CODE_STANDARD: this.configService.get('LARK_CONVERSATION_FOR_CODE_STANDARD'),
      PIPELINE_INFORM: this.configService.get('LARK_CONVERSATION_FOR_PIPELINE'),
      COOKIE_SCAN_INFORM: this.configService.get('LARK_CONVERSATION_FOR_COOKIE_SCAN'),
      INSIGHT_INFORM: this.configService.get('LARK_CONVERSATION_FOR_INSIGHT_INFORM'),
      ALERT: this.configService.get('LARK_CONVERSATION_FOR_ALERT'),
    };
  }

  /**
   * 发送消息
   */
  private async send(data: LarkMessage): Promise<LarkApiSendResponse | undefined> {
    try {
      const res = await this.httpService
        .post(this.path + '?async=false', data)
        .toPromise()
        .then((res) => {
          return res.data as LarkApiSendResponse;
        });

      if (res.waring) {
        this.logger.error(
          'lark send 发送结果异常: ' + res.waring + ' | ' + res.list.map((item) => item?.failureReason).join(','),
        );
      }
      return res;
    } catch (error) {
      this.logger.error('lark send 接口调用失败: ' + error);
    }
  }

  /**
   * 发送群消息
   * @param message
   * @param conversation
   * @returns
   */
  async sendGroupTextMessage(group: string, message: string) {
    const res = await this.send({
      receiver: [
        {
          chatId: group,
        },
      ],
      message: {
        text: message,
      },
    });
    return res;
  }

  /**
   * 发送用户消息
   * @param message
   * @param user
   * @returns
   */
  async sendUserTextMessage(user: string, message: string) {
    const res = await this.send({
      receiver: [
        {
          email: user,
        },
      ],
      message: {
        text: message,
      },
    });
    return res;
  }

  /**
   * 发送群消息，交互消息
   * @param group
   * @param message
   * @returns
   */
  private async sendGroupInteractiveMessage(group: string, message: LarkInteractiveMessage['message']) {
    const res = await this.send({
      receiver: [
        {
          chatId: group,
        },
      ],
      message,
    });
    return res;
  }

  /**
   * git commit 提交不符合规范的警告
   * @param value
   * @returns
   */
  async sendGitCommitWarning(value: GitSubmitWarningTemplateValueType) {
    const template = new GitSubmitWarningTemplate(value);
    const interactive = template.getTemplate();
    const res = await this.sendGroupInteractiveMessage(this.group.CODE_STANDARD, interactive);
    return res;
  }

  /**
   * git push 代码规范告警
   * @param value
   * @returns
   */
  async sendGitPushCodeStandardWarning(value: GitPushCodeStandardWarningTemplateValueType) {
    const template = new GitPushCodeStandardWarningTemplate(value);
    const interactive = template.getTemplate();
    const res = await this.sendGroupInteractiveMessage(this.group.CODE_STANDARD, interactive);
    return res;
  }

  /**
   * Virustotal 恶意可疑告警扫描报告
   * @param value
   * @returns
   */
  async sendVirustotalReport(value: VirustotalMaliciousScanReportTemplateValueType) {
    const template = new VirustotalMaliciousScanReportTemplate(value);
    const interactive = template.getTemplate();
    const res = await this.sendGroupInteractiveMessage(this.group.CODE_STANDARD, interactive);
    return res;
  }

  /**
   * 未配置路由可访问链接扫描报告
   * @param value
   * @returns
   */
  async sendRouteUnlinkReport(value: RouteUnlinkScanReportTemplateValueType) {
    const template = new RouteUnlinkScanReportTemplate(value);
    const interactive = template.getTemplate();
    const res = await this.sendGroupInteractiveMessage(this.group.CODE_STANDARD, interactive);
    return res;
  }

  /**
   * 未配置路由信息扫描报告
   * @param value
   * @returns
   */
  async sendRouteNotExistReport(value: RouteNotExistWarningTemplateValueType) {
    const template = new RouteNotExistWarningTemplate(value);
    const interactive = template.getTemplate();
    const res = await this.sendGroupInteractiveMessage(this.group.CODE_STANDARD, interactive);
    return res;
  }

  /**
   * 流水线执行结果通知
   * @param message
   * @param user
   * @returns
   */
  async sendPipelineInform(value: PipelineResultInformTemplateValueType) {
    let template;
    try {
      template = new PipelineResultInformTemplate(value);
    } catch (error) {
      this.logger.error('lark 消息模版生成失败: ' + error);
      throw new Error('lark 消息模版生成失败');
    }
    const interactive = template.getTemplate();
    try {
      await this.sendGroupInteractiveMessage(this.group.PIPELINE_INFORM, interactive);
    } catch (error) {
      this.logger.error('lark 发送通知失败:  ' + error);
      throw new Error('lark 发送通知失败');
    }
  }

  /**
   * Cookie扫描通知
   * @param message
   * @param user
   * @returns
   */
  async sendCookieScanInform(value: CookieChangeReportTemplateValueType, group?: string) {
    const template = new CookieChangeReportTemplate(value);
    const interactive = template.getTemplate();
    const res = await this.sendGroupInteractiveMessage(group ?? this.group.COOKIE_SCAN_INFORM, interactive);
    return res;
  }

  /**
   * 发送新特性公告
   */
  async sendNewFeatureInform(value: NewFeatureInformTemplateValueType) {
    const template = new NewFeatureInformTemplate(value);
    const interactive = template.getTemplate();
    const res = await this.sendGroupInteractiveMessage(this.group.INSIGHT_INFORM, interactive);
    return res;
  }

  /**
   * 发送停机更新通知
   * @param value
   * @returns
   */
  async sendShutDownInform(value: ShutdownUpdateInformTemplateValueType) {
    const template = new ShutdownUpdateInformTemplate(value);
    const interactive = template.getTemplate();
    const res = await this.sendGroupInteractiveMessage(this.group.INSIGHT_INFORM, interactive);
    return res;
  }

  /**
   * 发送合规代码扫描告警
   * @param value
   * @returns
   */
  async sendComplianceCodeWarning(value: ComplianceCodeWarningTemplateValueType) {
    const template = new ComplianceCodeWarningTemplate(value);
    const interactive = template.getTemplate();
    const res = await this.sendGroupInteractiveMessage(this.group.INSIGHT_INFORM, interactive);
    return res;
  }

  /**
   * 发送 密钥变更的提醒
   * @param value
   */
  async sendKeyChangeInform(
    value: {
      keyName: string;
    },
    user: string,
  ) {
    const res = await this.sendUserTextMessage(user, `🔑 密钥马上过期: ${value.keyName}, 请及时更换`);
    return res;
  }

  /**
   * 告警统计未处理消息通知
   * @param value
   * @returns
   */
  async sendAlertBacklogMessage(value: SendAlertBacklogMessageTemplateValueType) {
    const template = new SendAlertBacklogMessageTemplate(value);
    const interactive = template.getTemplate();
    const res = await this.sendGroupInteractiveMessage(this.group.ALERT, interactive);
    return res;
  }
}
