import { BaseTemplate } from './BaseTemplate';

export type PipelineResultInformTemplateValueType = {
  coverage_table: {
    type: string;
    total: string;
    covered: string;
    percentage: string;
  }[];
  project: string;
  branch: string;
  user: string;
  commit_id: string;
  commit_url: string;
  pipeline_table: {
    item: string;
    result: string;
    reason: string;
  }[];
  build_report_url: string;
  check_report_url: string;
};

export class PipelineResultInformTemplate extends BaseTemplate {
  constructor(values: PipelineResultInformTemplateValueType) {
    super();
    this.values = values;
    this.header = {
      template: 'blue',
      title: {
        content: '🚇 流水线消息通知',
        tag: 'plain_text',
      },
    };
    this.elements = [
      {
        tag: 'markdown',
        content: '**流水线信息**',
      },
      {
        tag: 'div',
        fields: [
          {
            is_short: true,
            text: {
              tag: 'lark_md',
              content: '**🗳 项目名称：**\n${project}',
            },
          },
          {
            is_short: true,
            text: {
              tag: 'lark_md',
              content: '**🎋 代码分支：**\n${branch}',
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
              content: '**💂‍♂️ 构建人：**\n<at email="${user}"></at>',
            },
          },
          {
            is_short: true,
            text: {
              tag: 'lark_md',
              content: '**🌿 提交哈希：**\n[${commit_id}](${commit_url})',
            },
          },
        ],
      },
      {
        tag: 'hr',
      },
      {
        tag: 'div',
        text: {
          content: '**检查信息**',
          tag: 'lark_md',
        },
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
                content: '**📦 检查项**',
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
                content: '**🛟 检查结果**',
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
                content: '**📟 原因**',
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
                content: '**${item}**',
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
                content: '${result}',
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
                content: '${reason}',
                text_align: 'center',
              },
            ],
          },
        ],
        _varloop: '${pipeline_table}',
      },
      {
        tag: 'hr',
      },
      {
        tag: 'div',
        text: {
          content: '**单测信息**',
          tag: 'lark_md',
        },
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
                content: '**📦 类型**',
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
                content: '**🧮 总数**',
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
                content: '**📔 覆盖**',
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
                content: '**💯 百分比**',
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
                content: '**${type}**',
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
                content: '${total}',
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
                content: '${covered}',
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
                content: '${percentage}',
                text_align: 'center',
              },
            ],
          },
        ],
        _varloop: '${coverage_table}',
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
              content: '构建报告',
            },
            type: 'primary',
            multi_url: {
              url: '${build_report_url}',
              pc_url: '',
              android_url: '',
              ios_url: '',
            },
          },
          {
            tag: 'button',
            text: {
              tag: 'plain_text',
              content: '检查报告',
            },
            type: 'primary',
            multi_url: {
              url: '${check_report_url}',
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
