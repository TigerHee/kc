/**
 * Owner: borden@kupotech.com
 */

/**
 * 配置subject
 * UI相关配置在 src/components/Root/Header/NoticeBar/config.js
 * 新增通知subject需要同时在这两处添加配置
 */
const SUBJECT_CONFIG = {
  // 价格上涨预警通知 (BTC-USDT最近成交价高于设定价格后推送)
  'notification.risen.to': {},
  // 价格下跌预警通知 (BTC-USDT最近成交价低于设定价格后推送)
  'notification.fell.to': {},
  // 多端登录
  'notification.login': {},
  // 资产到账
  'notification.deposit': {},
  // 离线下载
  'notification.download': {},
  // 资产到账-旧地址
  'notification.deposit.old.address': {},
  // 系统公告
  'notice.custom': {},
  // 场外交易新订单
  'verification.notice.new.order': {},
  // 杠杆开通杠杆交易
  'notification.margin-enable-margin': {},
  // 杠杆爆仓预警
  'notification.margin-liquidation-alert': {},
  // 杠杆强平还款
  'notification.margin-liquidate-repay': {},
  // 杠杆穿仓
  'notification.margin-negative-balance': {},
  // 杠杆爆仓
  'notification.margin-liquidation': {},
  // 自动还币(暂时不上)
  // 'notification.margin-auto-repay': {},
  // 还币提醒(暂时不上)
  // 'notification.margin-reminder-of-debt-repay': {},
  // 杠杆代币: 申购成功
  'notification.margin-subscription-success': {},
  // 杠杆代币: 赎回成功
  'notification.margin-redemption-success': {},
  // 杠杆代币: 申购失败
  'notification.margin-subscription-failed': {},
  // 杠杆代币: 赎回失败
  'notification.margin-redemption-failed': {},
  // 赠金未领取通知
  'notification.margin-bonus.bonus-not-receive': {},
  // 赠金未交易通知
  'notification.margin-bonus.bonus-not-trade': {},
  // 赠金首次交易通知
  'notification.margin-bonus.bonus-first-trade': {},
};

export default SUBJECT_CONFIG;
