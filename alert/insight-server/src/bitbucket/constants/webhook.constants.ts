import { AlarmMessageTypeEnum } from 'src/notification/constants/alarm.notification.constant';
import { DiffConfig, DiffType } from '../types/webhook.types';

const DIFF_TYPES = Object.values(DiffType); // 获取所有 DIFF 类型

const ROUTER_PATHS: string[] = ['router.config.js', 'routes.config.js'];

const ZERO_HASH = '0000000000000000000000000000000000000000';

const isCommentedLine = (line: string): boolean => {
  // 检查行是否以单行注释或多行注释开头
  const isCommented = line.trim().startsWith('//') || line.trim().startsWith('/*') || line.trim().startsWith('*');
  return isCommented;
};

const addCodeWarning = (alarmType: string, code: string): DiffConfig => {
  return {
    alarmType,
    ignoredParents: ['e2e', 'test', 'mock'],
    matchLine: (line) => {
      // 如果行以注释开头，则不进行匹配
      if (isCommentedLine(line)) {
        return false;
      }
      return line.includes(code);
    },
    warnText: `${alarmType}警告，新增代码 ${code}`,
    diffTypes: [DiffType.ADDED],
  };
};

const thirdPartyJsWarning: DiffConfig = {
  alarmType: AlarmMessageTypeEnum.THIRD_PARTY,
  warnText: '第三方资源检查，新增代码 xx.js',
  ignoredParents: ['e2e', 'test', 'mock'],
  matchLine: (line) => {
    // 如果行以注释开头，则不进行匹配
    if (isCommentedLine(line)) {
      return false;
    }
    // 使用正则表达式检查行是否包含 http:// 或 https:// 并且以 .js 结尾
    const regex = /https?:\/\/[^\s]+\.js(\?.*)?$/;
    return regex.test(line);
  },
  diffTypes: [DiffType.ADDED],
};

const xssFunctions: string[] = [
  'qs.parse',
  'useParams',
  'useLocation',
  'searchToJson',
  'useUrlParams',
  'useQueryParams',
  'parseQuery',
  'withRouter',
  'useSearch',
  'urlParse',
  'getFullURL',
  'getURLParameter',
  'useUrlParams',
];
const xssStrings: string[] = ['initialParams', 'searchQuery', 'kucoin_robot_from', '<Redirect', '<Link'];
const generateXssQueryRegex = (functions: string[], strings: string[]): RegExp => {
  const functionRegex = `\\b(?:${functions.join('|')})\\s*\\(`;
  const stringRegex = `\\s*(?:${strings.join('|')})\\b`;

  const regexString = `(${functionRegex})|(${stringRegex})`;
  return new RegExp(regexString, 'g');
};
/**
 * 基于Diff内容的告警配置
 * 代码检查配置
 */
const PUSH_DIFF: DiffConfig[] = [
  {
    alarmType: AlarmMessageTypeEnum.ROUTER,
    warnText: 'url发生变化，请检查seo的规范',
    diffTypes: DIFF_TYPES,
    fileNames: ROUTER_PATHS,
    matchLine: (line) => {
      return line.includes('path:');
    },
  },
  {
    alarmType: AlarmMessageTypeEnum.ROUTER,
    warnText: 'SEO语言路径优化，禁止新增路由第一级使用两位英文字符',
    diffTypes: [DiffType.ADDED],
    fileNames: ROUTER_PATHS,
    matchLine: (line: string) => {
      // 如果行以注释开头，则不进行匹配
      if (isCommentedLine(line)) {
        return false;
      }
      // 提取 path 值
      const match = line.match(/path:\s*['"]([^'"]+)['"]/);
      if (match) {
        const pathValue = match[1];

        // 检查第一级路径是否为两位英文字符
        return /^\/[a-zA-Z]{2}(\/|$)/.test(pathValue);
      }
      // 如果没有匹配到 path 或路径值为空，认为是合法的
      return false;
    },
  },
  {
    alarmType: AlarmMessageTypeEnum.IMG,
    warnText: `img标签alt属性 非空警告`,
    ignoredParents: ['e2e', 'test', 'mock'],
    diffTypes: [DiffType.ADDED],
    matchLine: (line: string) => {
      // 如果行以注释开头，则不进行匹配
      if (isCommentedLine(line)) {
        return false;
      }
      const match = line.match(/<img[^>]*\s+alt="(.*?)"[^>]*>|<img(?!.*alt)[^>]*>/);
      //匹配参数值是否为空
      return match && !match[1]?.trim();
    },
  },
  addCodeWarning(AlarmMessageTypeEnum.HARDCODE, 'kucoin.com'),
  thirdPartyJsWarning,
];

const COMMENTS_DIFF: DiffConfig[] = [
  {
    alarmType: AlarmMessageTypeEnum.XSS,
    warnText: '检查不可信任的页面参数调用产生XSS',
    matchLine: (line: string) => {
      // 如果行以注释开头，则不进行匹配
      if (isCommentedLine(line)) {
        return false;
      }
      return generateXssQueryRegex(xssFunctions, xssStrings).test(line);
    },
    ignoredParents: ['e2e', 'test', 'mock'],
    diffTypes: [DiffType.ADDED],
    diffLineOnly: true,
  },
  {
    alarmType: AlarmMessageTypeEnum.COMPLIANCE,
    warnText: `请检查是否满足以下合规要求：

    - 香港合规：受限地区IP禁用具有营销属性的文案&弹窗&页面
    - 英国合规：受限地区IP禁用具有营销属性的文案&弹窗&页面
    - 法国合规：受限地区IP全站禁用法语
    - 奥地利合规：受限地区IP禁用预填手机区号逻辑；受限地区IP全站禁用德语
    - 澳大利亚合规：产品清退（杠杆代币、结构化产品、合约）
    - 全站合规：确认Halo Wallet产品信息描述`,
    diffTypes: [DiffType.ADDED],
    diffLineOnly: true,
  },
  {
    alarmType: AlarmMessageTypeEnum.RELOAD,
    warnText: '检查reload是否会造成死循环刷新',
    diffTypes: [DiffType.ADDED],
    ignoredParents: ['e2e', 'test', 'mock'],
    matchLine: (line: string) => {
      // 如果行以注释开头，则不进行匹配
      if (isCommentedLine(line)) {
        return false;
      }
      return /window\.location\.reload\(\s*(true|false)?\s*\)/.test(line);
    },
  },
  {
    alarmType: AlarmMessageTypeEnum.I18N,
    warnText: '检查语言文件内的键值不能为空，确保上线合入的多语言没有空值！',
    matchLine: (line: string) => {
      // const match = line.match(/"([^"]+)":\s*"([^"]*)"/);
      const match = line.match(/"([^"]*)":\s*"([^"]*)"/);
      if (match) {
        const key = match[1];
        const value = match[2];
        return value === '' || key === '';
      }
    },
    diffTypes: [DiffType.ADDED],
    parentSrc: 'cdnAssets/static/locales',
    diffLineOnly: true,
  },
  {
    alarmType: AlarmMessageTypeEnum.ROUTER,
    warnText: '路由path或多租户发生更改, 请检查!',
    diffTypes: DIFF_TYPES,
    fileNames: ROUTER_PATHS,
    matchLine: (line: string) => {
      return line.includes('path:') || line.includes('activeBrandKeys');
    },
  },
  thirdPartyJsWarning,
];

export { PUSH_DIFF, COMMENTS_DIFF, DIFF_TYPES, ROUTER_PATHS, ZERO_HASH };
