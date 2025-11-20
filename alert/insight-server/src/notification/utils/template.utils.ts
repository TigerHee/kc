import { WebhookInfoType } from 'src/bitbucket/types/webhook.types';
import { PlatformTypeItem, ThreatTypeItem } from '../constants/safebrowsing.notification.constant';
import { RoutesDocument } from 'src/insight/schemas/route.schema';
import { UserDocument } from 'src/auth/schemas/user.schema';

export const genOnetrustCookieDiffTemplate = (params: {
  data: {
    line: string;
    color: 'green' | 'red' | 'yellow' | 'black' | string;
  }[];
  domain: string;
  last_latest_scan_time: string;
  verbose: boolean;
}) => {
  const { data, last_latest_scan_time, domain, verbose } = params;
  const last = `<div>
                  <b>上次扫描时间: </b>${last_latest_scan_time}
                </div><br />
                <div><b>扫描站点: </b>${domain}</div><br />
                <div><b>啰嗦模式: </b>${verbose ? '开启' : '关闭'}</div><br />`;
  let title = '<div><b>扫描结果:</b></div><br />';
  let lines = '';
  if (Array.isArray(data) && data.length !== 0) {
    lines = data.map((line) => `<div style="color: ${colorMap[line.color]}">${line.line}</div><br />`).join('');
  } else {
    title = `<div><b>扫描结果:</b> <span style="color: ${colorMap['green']}">无变更</span></div>`;
  }
  return `${last}${title}${lines}`;
};

type colorType = 'green' | 'red' | 'yellow' | 'black' | 'accent' | 'grey' | 'unset';

const colorMap: Record<colorType, string> = {
  green: '#008000',
  red: '#FF0000',
  yellow: '#FF8B00',
  black: '#000000',
  accent: '#aab1fa',
  grey: '#7A869A',
  unset: 'unset',
};

const fileTypeMap = {
  ADDED: {
    symbol: '+',
    numberType: 'destination',
  },
  REMOVED: {
    symbol: '-',
    numberType: 'source',
  },
};

export const escapeHtml = (unsafe: string): string =>
  unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

export type WarnType = {
  srcPath: string;
  warnText: string;
  diffPath: {
    type: string;
    lines: { line: string }[];
  }[];
};

const genParagraphHTML = (key: string, value: string, color: colorType = 'unset'): string =>
  `<div style="display: flex;">
    <b style="width: 82px;">${escapeHtml(key)}：</b>
    <span style="color: ${colorMap[color]};flex:1;">${value}</span>
  </div><p style="height: 10px;margin: 0"></p>`;

const genLinkHTML = (key: string, value: string, url: string): string =>
  `<p style="display: flex;">
      <b style="width: 82px;">${escapeHtml(key)}：</b>
      <a style="flex:1;" href="${escapeHtml(url)}">${value}</a>
    </p><p style="height: 10px;margin: 0"></p>`;

const genCodeChangeHTML = (line: { line: string }, type: string): string => `
    <p style="font-size: 12px; font-family: monospace; color: #172B4D; white-space: nowrap; background-color: #ddffdd; overflow: auto;">
      <span>${line[fileTypeMap[type].numberType]}</span>
      <span style="width: 20px; text-align: center; vertical-align: top; display: inline-block; margin: 0 2px;">
      ${fileTypeMap[type].symbol}
      </span>
      <span style="word-wrap: normal;">${escapeHtml(line.line)}</span>
    </p>`;

const genSubTitleHTML = (title: string, subTitle: string, color: colorType = 'unset'): string =>
  `<div style="margin-bottom: 5px;">
    <b style="color: ${colorMap[color]};">${escapeHtml(title)}</b>
    <p style="color: ${colorMap['grey']};">${subTitle}</p>
  </div>`;

const getBaseBodyHtml = (info: Partial<WebhookInfoType> = {}) => {
  const { authorEmail, slug, branch, commitId, prId, commitLint, message, commitUrl, prUrl } = info;
  const baseInfo = [
    { key: '仓库名称', value: slug },
    { key: '分支名称', value: branch },
    { key: '提交作者', value: authorEmail },
    { key: '提交规范', value: commitLint, color: 'red' },
    { key: 'CommitId', value: commitId, url: commitUrl },
    { key: 'PR ID', value: prId, url: prUrl },
    { key: '提交信息', value: message, color: 'grey' },
  ];
  return baseInfo
    .filter(({ value }) => !!value) // 过滤掉无效值
    .map(({ key, value, color, url }) =>
      url ? genLinkHTML(key, value, url) : genParagraphHTML(key, value, color as colorType),
    )
    .join('');
};

export const genWarnDetailsHTML = (warns: WarnType[]) => {
  return warns
    .flatMap(({ srcPath, diffPath, warnText }) => {
      // 处理 diffPath 的行内容
      const diffPathHTML = diffPath
        .flatMap(({ type, lines }) => lines.map((line) => genCodeChangeHTML(line, type)))
        .join('');
      const warnTitleHTML = genSubTitleHTML(warnText, srcPath, 'yellow');
      return `<div style="margin-bottom: 10px;">
              ${warnTitleHTML}${diffPathHTML}
              </div>`;
    })
    .join('');
};

// 生成带警告信息的 HTML
export const genWarnInfoHTML = (info: Partial<WebhookInfoType> = {}, warns?: WarnType[]) => {
  const warnDetailsHTML = warns ? genWarnDetailsHTML(warns) : '';
  const adaptivecard = {
    text: `${getBaseBodyHtml(info)} ${warnDetailsHTML}`,
  };

  return adaptivecard;
};

export const genRoutesHtml = (config = []) => {
  const rows = config
    .map(
      (item) => `
      <tr>
        <td>${item.projectName}</td>
        <td>${item.count}</td>
        <td>${item.owner}</td>
      </tr>
    `,
    )
    .join('&nbsp;');

  return {
    title: '未配置新增的路由扫描',
    text: `<div>
            <table>
              <thead>
                <tr>
                <th>项目</th>
                <th>未配置路由数量</th>
                <th>负责人</th>
                </tr>
              </thead>
            <tbody>${rows}</tbody>
           </table>
          </div>`,
  };
};

export const genUnConfiguredAccessibleLinkHtml = (config: RoutesDocument[]) => {
  const rows = config
    .map(
      (item) => `
      <tr>
        <td>${item.path}</td>
        <td>${(item.user as UserDocument).email}</td>
      </tr>
    `,
    )
    .join('&nbsp;');

  return {
    title: '未配置路由可访问链接扫描',
    text: `<div>
            <table>
              <thead>
                <tr>
                <th>路由</th>
                <th>负责人</th>
                </tr>
              </thead>
            <tbody>${rows}</tbody>
           </table>
          </div>`,
  };
};

export const genSafebrowsingHtml = (domains = [], insightUrl) => {
  const rows = domains
    .map(
      (item) => `
      <tr>
        <td>${item.threat.url}</td>
        <td>${ThreatTypeItem[item.threatType]}</td>
        <td>${item.threatEntryType}</td>
        <td>${PlatformTypeItem[item.platformType]}</td>
      </tr>
    `,
    )
    .join('&nbsp;');

  return {
    title: 'Safebrowsing 威胁告警扫描',
    text: `<div>
            <table>
              <thead>
                <tr>
                <th style="width: 100px;">域名</th>
                <th style="width: 100px;">威胁类型</th>
                <th style="width: 105px;">威胁条目类型</th>
                <th>平台类型</th>
                </tr>
              </thead>
            <tbody>${rows}</tbody>
           </table>
          </div>`,
    buttons: [{ title: '查看 Safebrowsing 报告', open_url: `${insightUrl}/report/safebrowsing` }],
  };
};

export const genVirustotalHtml = (domains = [], insightUrl: string) => {
  const rows = domains
    .map(
      (item) => `
      <tr>
        <td>${item.id}</td>
        <td>${item.malicious}</td>
        <td>${item.suspicious}</td>
      </tr>
    `,
    )
    .join('&nbsp;');

  return {
    title: 'Virustotal 恶意可疑告警扫描',
    text: `<div>
            <table>
              <thead>
                <tr>
                <th style="width: 200px;">域名</th>
                <th>恶意数量</th>
                <th>可疑数量</th>
                </tr>
              </thead>
            <tbody>${rows}</tbody>
           </table>
          </div>`,
    buttons: [{ title: '查看 Virustotal 报告', open_url: `${insightUrl}/report/virustotal` }],
  };
};
