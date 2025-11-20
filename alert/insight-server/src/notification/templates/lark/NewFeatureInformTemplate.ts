import { BaseTemplate } from './BaseTemplate';

export type NewFeatureInformTemplateValueType = {
  manuals_url: string;
  feature_url: string;
  feature: string;
};
export class NewFeatureInformTemplate extends BaseTemplate {
  constructor(values: NewFeatureInformTemplateValueType) {
    super();
    this.values = values;
    this.config = {
      wide_screen_mode: true,
    };
    this.header = {
      template: 'orange',
      title: {
        tag: 'plain_text',
        content: '📣 新功能发布，欢迎体验！',
      },
    };
    this.elements = [
      {
        tag: 'div',
        text: {
          content: '<at id=all></at>\n${feature}',
          tag: 'lark_md',
        },
      },
      {
        alt: {
          content: '',
          tag: 'plain_text',
        },
        img_key: 'img_v3_02lf_989bae0a-c222-4fd7-a427-ec41c90736hu',
        tag: 'img',
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
              content: '使用手册',
            },
            type: 'primary',
            multi_url: {
              url: '${manuals_url}',
              pc_url: '',
              android_url: '',
              ios_url: '',
            },
          },
          {
            tag: 'button',
            text: {
              content: '立即体验',
              tag: 'plain_text',
            },
            type: 'primary',
            multi_url: {
              url: '${feature_url}',
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
