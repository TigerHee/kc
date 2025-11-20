import { BaseTemplate } from './BaseTemplate';

export type CookieChangeReportTemplateValueType = {
  last_scan_time: string;
  domain: string;
  mode: string;
  result: string;
  change_table: {
    item: string;
    type: string;
  }[];
};

export class CookieChangeReportTemplate extends BaseTemplate {
  constructor(values: CookieChangeReportTemplateValueType) {
    super();
    this.values = values;
    this.header = {
      template: 'blue',
      title: {
        content: '🍪 站点Cookie扫描结果',
        tag: 'plain_text',
      },
    };
    this.elements = [
      {
        tag: 'div',
        fields: [
          {
            is_short: true,
            text: {
              tag: 'lark_md',
              content: '**⏰ 上次扫描：**\n${last_scan_time}',
            },
          },
          {
            is_short: true,
            text: {
              tag: 'lark_md',
              content: '**🌏 扫描站点：**\n[${domain}](${domain})',
            },
          },
        ],
      },
      {
        tag: 'div',
        fields: [
          {
            is_short: true,
            text: {
              tag: 'lark_md',
              content: '**🗳 啰嗦模式：**\n${mode}',
            },
          },
          {
            is_short: true,
            text: {
              tag: 'lark_md',
              content: '**🛟 扫描结果：**\n${result}',
            },
          },
        ],
      },
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
                content: '**结果项**',
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
                content: '**变更类型**',
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
                content: '${item}',
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
                content: '${type}',
              },
            ],
          },
        ],
        _varloop: '${change_table}',
      },
    ];
  }
}
