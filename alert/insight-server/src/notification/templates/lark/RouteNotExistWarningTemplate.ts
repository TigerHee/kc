import { BaseTemplate } from './BaseTemplate';

export type RouteNotExistWarningTemplateValueType = {
  route_table: {
    user: string;
    route: string;
    count: string;
  }[];
};

export class RouteNotExistWarningTemplate extends BaseTemplate {
  constructor(values: RouteNotExistWarningTemplateValueType) {
    super();
    this.values = values;
    this.header = {
      template: 'red',
      title: {
        content: '⚠️ 未配置路由信息',
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
                content: '**项目**',
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
                content: '**未配置路由数量**',
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
                content: '${count}',
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
                content: '${user}',
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
          content: '<font color="grey">生产环境扫描站点存在的路由地址，但是未同步至前端开发平台上</font>',
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
