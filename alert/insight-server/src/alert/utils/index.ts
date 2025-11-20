const isDev = process.env.NODE_ENV === 'development';

// 告警组
export const ALARM_GROUP_LIST = isDev
  ? ['3.0Sit告警组', '线上服务down', 'ATS日志告警组', 'kyc组保活pod', '支付值班组', 'OPS-INFO']
  : [
      // 用户
      '用户前端值班组',
      '首页前端值班组',
      '合规前端值班组',
      '前端 ucenter_rn 值班组',
      'web3前端值班组',
      'g-biz巡检告警群',
      // 交易
      '交易前端值班组',
      'trade-public-web前端值班组',
      '机器人前端值班组',
      '资产assets-web值班组',
      '跟单业务值班组',
      '合约前端值班表-WEBSITE',
      'margin-web-3.0',
      // 增长
      'pay-web',
      'growth-web',
      'marketing-frontend',
      'earn-frontend',
      // 基建
      'SEO前端值班组',
      'SEO-SERVICE',
      '前端部门值班组',
      // 公共
      'kucoin-main-web值班组',
      'public-web值班组',
      // 其他
      'frontend-domain-error',
    ];

// 状态列表
// 状态枚举
export enum Status {
  INIT = '1',
  MISS = '2',
  URGENCY = '3',
  NOT_URGENCY = '4',
  DEPEND = '5',
  PENDING = '6',
}

export const STATUS_LIST = [
  { label: '未处理', value: Status.INIT, isCanFinish: false },
  { label: '不是问题 - 误报、噪音', value: Status.MISS, isCanFinish: false },
  { label: '是问题 - 紧急 - 立即修复', value: Status.URGENCY, isCanFinish: true },
  { label: '是问题 - 不紧急 - 下个迭代修复', value: Status.NOT_URGENCY, isCanFinish: true },
  { label: '是问题 - 上下游问题', value: Status.DEPEND, isCanFinish: true },
  { label: '持续观察', value: Status.PENDING, isCanFinish: true },
];

export const TIME_LAG8 = 8 * 60 * 60 * 1000;
