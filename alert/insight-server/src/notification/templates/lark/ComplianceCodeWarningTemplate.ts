import { BaseTemplate } from './BaseTemplate';

export type ComplianceCodeWarningTemplateValueType = {
  repos: string;
  country: string;
  suffix: string;
  ign_files: string;
  report_url: string;
  add_num: number;
  reduce_num: number;
};
export class ComplianceCodeWarningTemplate extends BaseTemplate {
  constructor(values: ComplianceCodeWarningTemplateValueType) {
    super();
    this.values = values;
    this.header = {
      template: 'yellow',
      title: {
        content: '🛎️ 合规代码扫描，发现变更',
        tag: 'plain_text',
      },
    };
    this.elements = [
      {
        tag: 'markdown',
        content: '**🏴 国家范围:**\n${country}',
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
                tag: 'div',
                text: {
                  content: '**🟠 仓库范围:**\n${repos}',
                  tag: 'lark_md',
                },
              },
            ],
          },
          {
            tag: 'column',
            width: 'weighted',
            weight: 1,
            vertical_align: 'top',
            elements: [],
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
                tag: 'div',
                text: {
                  content: '**🧬 后缀范围:**\n${suffix}',
                  tag: 'lark_md',
                },
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
                content: '**🗂️ 忽略文件:**\n${ign_files}',
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
                tag: 'div',
                text: {
                  content: '**➕ 新增项数量:**\n${add_num}',
                  tag: 'lark_md',
                },
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
                content: '**− 删除项数量:**\n${reduce_num}',
              },
            ],
          },
        ],
      },
      {
        tag: 'hr',
      },
      {
        tag: 'action',
        actions: [
          {
            tag: 'button',
            text: {
              tag: 'plain_text',
              content: '报告详情',
            },
            type: 'primary',
            multi_url: {
              url: '${report_url}',
              pc_url: '',
              android_url: '',
              ios_url: '',
            },
          },
        ],
      },
    ];
  }
}
