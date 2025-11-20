import { BaseTemplate } from './BaseTemplate';

export type RouteUnlinkScanReportTemplateValueType = {
  route_table: {
    user: string;
    route: string;
  }[];
};

export class RouteUnlinkScanReportTemplate extends BaseTemplate {
  constructor(values: RouteUnlinkScanReportTemplateValueType) {
    super();
    this.values = values;
    this.header = {
      template: 'red',
      title: {
        content: '⚠️ 未配置路由可访问链接的路由',
        tag: 'plain_text',
      },
    };
    this.elements = [
      {
        tag: 'column_set',
        flex_mode: 'none',
        background_style: 'grey',
        columns: [
          {
            tag: 'column',
            width: 'weighted',
            weight: 1,
            vertical_align: 'top',
            elements: [
              {
                tag: 'markdown',
                content: '**路由**',
                text_align: 'center',
              },
            ],
          },
          {
            tag: 'column',
            width: 'weighted',
            weight: 1,
            vertical_align: 'top',
            elements: [
              {
                tag: 'markdown',
                content: '**负责人**',
                text_align: 'center',
              },
            ],
          },
        ],
      },
      {
        tag: 'column_set',
        flex_mode: 'none',
        background_style: 'default',
        columns: [
          {
            tag: 'column',
            width: 'weighted',
            weight: 1,
            vertical_align: 'top',
            elements: [
              {
                tag: 'markdown',
                content: '${route}',
                text_align: 'center',
              },
            ],
          },
          {
            tag: 'column',
            width: 'weighted',
            weight: 1,
            vertical_align: 'top',
            elements: [
              {
                tag: 'markdown',
                content: '<at email="${user}"></at>',
                text_align: 'center',
              },
            ],
          },
        ],
        _varloop: '${route_table}',
      },
      {
        tag: 'hr',
      },
      {
        tag: 'div',
        text: {
          tag: 'lark_md',
          content: "<font color='grey'>前端开发者平台的路由列表存在的路由记录，但是「可访问链接」为空</font>",
        },
        extra: {
          tag: 'button',
          text: {
            tag: 'lark_md',
            content: '前往配置',
          },
          type: 'primary',
          multi_url: {
            url: 'https://insight.kcprd.com/project/route',
            pc_url: '',
            android_url: '',
            ios_url: '',
          },
        },
      },
    ];
  }
}
