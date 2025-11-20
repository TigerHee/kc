import { BaseTemplate } from './BaseTemplate';

export type SendAlertBacklogMessageTemplateValueType = {
  tableData: {
    alarmGroup: string;
    count: string;
    latestTeamsSendList: string[];
    latestCreateTime: number;
    emailBatch: string;
  }[];
};

export class SendAlertBacklogMessageTemplate extends BaseTemplate {
  constructor(values: SendAlertBacklogMessageTemplateValueType) {
    super();
    this.values = values;
    this.header = {
      template: 'orange',
      title: {
        content: '🔔 未处理告警数据统计',
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
                content: '**告警组**',
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
                content: '**未处理数量**',
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
                content: '**值班人**',
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
                content: '${alarmGroup}',
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
                content: '${emailBatch}',
                // content: '<at email="${email}"></at>',
                text_align: 'center',
              },
            ],
          },
        ],
        _varloop: '${tableData}',
      },
    ];
  }
}
