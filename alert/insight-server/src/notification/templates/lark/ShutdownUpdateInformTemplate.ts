import { BaseTemplate } from './BaseTemplate';

export type ShutdownUpdateInformTemplateValueType = {
  content: string;
  start: string;
  finish: string;
};

export class ShutdownUpdateInformTemplate extends BaseTemplate {
  constructor(values: ShutdownUpdateInformTemplateValueType) {
    super();
    this.values = values;
    this.config = {
      wide_screen_mode: true,
    };
    this.header = {
      template: 'red',
      title: {
        content: '🧯 系统停机更新',
        tag: 'plain_text',
      },
    };
    this.elements = [
      {
        alt: {
          content: '',
          tag: 'plain_text',
        },
        img_key: 'img_v3_02lf_73da8c80-4021-4323-a94c-2d8eeb0658hu',
        tag: 'img',
      },
      {
        tag: 'div',
        fields: [
          {
            is_short: true,
            text: {
              tag: 'lark_md',
              content: '**🕛 开始时间：**\n${start}',
            },
          },
          {
            is_short: true,
            text: {
              tag: 'lark_md',
              content: '**⏰ 完成时间：**\n${finish}',
            },
          },
        ],
      },
      {
        tag: 'hr',
      },
      {
        tag: 'markdown',
        content: '<at id=all></at>\n${content}',
      },
    ];
  }
}
