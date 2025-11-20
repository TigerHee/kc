import { BaseTemplate } from './BaseTemplate';

export type GitSubmitWarningTemplateValueType = {
  project: string;
  branch: string;
  author: string;
  standard: string;
  message: string;
  commit_url: string;
  commit_id: string;
  plan_name: string;
  plan_url: string;
  standard_wiki: string;
};

/**
 * https://open.larksuite.com/tool/cardbuilder?templateId=ctp_AARX6CN7negJ
 */
export class GitSubmitWarningTemplate extends BaseTemplate {
  constructor(values: GitSubmitWarningTemplateValueType) {
    super();
    this.values = values;
    this.header = {
      template: 'red',
      title: {
        content: '🚨 提交信息不符合规范',
        tag: 'plain_text',
      },
    };
    this.elements = [
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
                  content: '**🔴 仓库名称:**\n${project}',
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
                tag: 'div',
                text: {
                  content: '**🎋 代码分支:**\n${branch}',
                  tag: 'lark_md',
                },
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
                  content: '**👤 提交作者:**\n<at email="${author}"></at>',
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
                content: '**🌿 提交哈希:**\n[${commit_id}](${commit_url})',
              },
            ],
          },
        ],
      },
      {
        tag: 'hr',
      },
      {
        tag: 'div',
        fields: [
          {
            is_short: true,
            text: {
              tag: 'lark_md',
              content: '**🗳 流程规范：**\n<font color="red">***${standard}***</font>',
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
              content: '**📝 提交信息：**\n${message}',
            },
          },
        ],
      },
      {
        tag: 'hr',
      },
      {
        tag: 'markdown',
        content: '🔗 <font color="#ccc">技术方案：</font>[${plan_name}](${plan_url})\n',
      },
      {
        tag: 'hr',
      },
      {
        tag: 'note',
        elements: [
          {
            tag: 'img',
            img_key: 'img_v2_e5d9761f-3b78-47f2-9fa6-f8438c46861h',
            alt: {
              tag: 'plain_text',
              content: '',
            },
          },
          {
            tag: 'plain_text',
            content: '参考文档  ${standard_wiki}',
          },
        ],
      },
    ];
  }
}
