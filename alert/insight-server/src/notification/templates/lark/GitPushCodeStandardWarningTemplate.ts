import { BaseTemplate } from './BaseTemplate';

export type GitPushCodeStandardWarningTemplateValueType = {
  project: string;
  branch: string;
  author: string;
  message: string;
  commit_url: string;
  commit_id: string;
  plan_name: string;
  plan_url: string;
  issue_table: {
    content: string;
    path: string;
    standard: string;
  }[];
};

/**
 * https://open.larksuite.com/tool/cardbuilder?templateId=ctp_AARXVFQysuhm
 */
export class GitPushCodeStandardWarningTemplate extends BaseTemplate {
  constructor(values: GitPushCodeStandardWarningTemplateValueType) {
    super();
    this.values = values;
    this.header = {
      template: 'violet',
      title: {
        content: '🚨 编码规范告警',
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
              content: "**📝 提交信息：**\n<font color='grey'>${message}</font>",
            },
          },
        ],
      },
      {
        tag: 'column_set',
        flex_mode: 'stretch',
        background_style: 'default',
        columns: [
          {
            tag: 'column',
            width: 'weighted',
            weight: 2,
            vertical_align: 'top',
            elements: [
              {
                tag: 'column_set',
                flex_mode: 'flow',
                background_style: 'grey',
                columns: [
                  {
                    tag: 'column',
                    width: 'weighted',
                    weight: 1,
                    vertical_align: 'top',
                    elements: [
                      {
                        tag: 'div',
                        fields: [
                          {
                            is_short: true,
                            text: {
                              tag: 'lark_md',
                              content: '**🗳 告警内容**',
                            },
                          },
                          {
                            is_short: true,
                            text: {
                              tag: 'lark_md',
                              content: '**📝 代码块**',
                            },
                          },
                        ],
                      },
                    ],
                  },
                ],
                _varloop: '${issue_table}',
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
                content: "<font color='red'>***${standard}***\n</font><font color='grey'>${path}</font>",
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
                content: '${content}',
              },
            ],
          },
        ],
        _varloop: '${issue_table}',
      },
      {
        tag: 'hr',
      },
      {
        tag: 'markdown',
        content: '🔗 <font color="#ccc">***技术方案：***</font>[${plan_name}](${plan_url})\n',
      },
    ];
  }
}
