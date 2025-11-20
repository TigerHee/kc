import { BaseTemplate } from './BaseTemplate';

export type VirustotalMaliciousScanReportTemplateValueType = {
  vitustotal_table: {
    domain: string;
    malicious: string;
    suspicious: string;
  }[];
  malicious_count: string;
  suspicious_count: string;
  malicious_percent: string;
  suspicious_percent: string;
};

export class VirustotalMaliciousScanReportTemplate extends BaseTemplate {
  constructor(values: VirustotalMaliciousScanReportTemplateValueType) {
    super();
    this.values = values;
    this.header = {
      template: 'yellow',
      title: {
        content: '䷽ Virustotal 恶意可疑告警扫描',
        tag: 'plain_text',
      },
    };
    this.elements = [
      {
        tag: 'markdown',
        content: '**统计数据**\n',
      },
      {
        tag: 'column_set',
        flex_mode: 'flow',
        background_style: 'grey',
        horizontal_spacing: 'default',
        columns: [
          {
            tag: 'column',
            width: 'weighted',
            weight: 1,
            elements: [
              {
                tag: 'markdown',
                text_align: 'center',
                content: '恶意数量\n**${malicious_count}**\n${malicious_percent}',
              },
            ],
          },
          {
            tag: 'column',
            width: 'weighted',
            weight: 1,
            elements: [
              {
                tag: 'markdown',
                text_align: 'center',
                content: '可疑数量\n**${suspicious_count}**\n${suspicious_percent}',
              },
            ],
          },
        ],
      },
      {
        tag: 'markdown',
        content: '**明细数据**',
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
                content: '**域名**',
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
                content: '**恶意数量**',
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
                content: '**可疑数量**',
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
                content: '${domain}',
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
                content: '${malicious}',
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
                content: '${suspicious}',
                text_align: 'center',
              },
            ],
          },
        ],
        _varloop: '${vitustotal_table}',
      },
    ];
  }
}
