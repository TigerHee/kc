/**
 * Owner: willen@kupotech.com
 */
import { _t } from 'tools/i18n';

// 安全问题的唯一标志key
export const QUESTION_KEYS = {
  deposit: '1', // 最近充提的币种
  tradeCoin: '2', // 最近交易币种
  holdBtc: '3', // 持有BTC数量
  holdUSDT: '4', // 持有的 USDT数量
  accountCoin: '5', // 您账户相关的币种
  KYCStatus: '6', // KYC认证状态
  country: '7', // 账户国籍
  KYCName: '8', // KYC认证姓名
  nikeName: '9', // 账户昵称
};
// 所有安全问题[id, name]
export const QUESTION_LIST = new Map([
  [QUESTION_KEYS.deposit, () => _t('selfService2.questionSecurity.q1')],
  [QUESTION_KEYS.tradeCoin, () => _t('selfService2.questionSecurity.q2')],
  [QUESTION_KEYS.holdBtc, () => _t('selfService2.questionSecurity.q3')],
  [QUESTION_KEYS.holdUSDT, () => _t('selfService2.questionSecurity.q4')],
  [QUESTION_KEYS.accountCoin, () => _t('selfService2.questionSecurity.q5')],
  [QUESTION_KEYS.KYCStatus, () => _t('selfService2.questionSecurity.q6')],
  [QUESTION_KEYS.KYCName, () => _t('selfService2.questionSecurity.q7')],
  [QUESTION_KEYS.country, () => _t('selfService2.questionSecurity.q8')],
  [QUESTION_KEYS.nikeName, () => _t('selfService2.questionSecurity.q9')],
]);

// 所有问题的选项文本
export const OPTIONS = new Map([
  ['NONE', () => _t('selfService2.questionSecurity.q1answer1')],
  ['17', () => _t('selfService2.questionSecurity.q6answer1')],
  ['18', () => _t('selfService2.questionSecurity.q6answer2')],
  ['19', () => _t('selfService2.questionSecurity.q6answer3')],
  ['20', () => _t('selfService2.questionSecurity.q6answer4')],
  ['21', () => _t('selfService2.questionSecurity.q6answer5')],
  ['22', () => _t('selfService2.questionSecurity.q6answer6')],
]);
