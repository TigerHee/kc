/**
 * Owner: harry.lai@kupotech.com
 */
import { _t } from 'src/tools/i18n';
import depositIcon from 'static/slothub/detail-task-deposit-icon.svg';
import exchangeIcon from 'static/slothub/detail-task-exchange-icon.svg';
import inviteIcon from 'static/slothub/detail-task-invite-icon.svg';
import learnIcon from 'static/slothub/detail-task-learn-icon.svg';
import tradeIcon from 'static/slothub/detail-task-trade-icon.svg';
import { DepositTaskProcess } from './components/DepositTaskProcess';
import { ExchangeTaskProcess } from './components/ExchangeTaskProcess';
import { InviteTaskProcess } from './components/InviteTaskProcess';
import { LearnTaskProcess } from './components/LearnTaskProcess';
import { TradeTaskProcess } from './components/TradeTaskProcess';

export const TASK_ACTIVITY_TYPE = {
  deposit: 'deposit',
  tradingReward: 'tradingReward',
  invitation: 'invitation',
  signExchange: 'signExchange',
  learn: 'learn',
};
/**
 * 根据动态下发的交易与充值任务信息和常驻的邀请与通用任务信息，构造一个任务信息列表。
 *
 * @param {object} params - 包含所有任务信息的对象。
 * @param {object} params.depositTaskInfo - 充值任务的动态配置信息。
 * @param {object} params.tradeTaskInfo - 交易任务的动态配置信息。
 * @returns {Array} 完整的任务信息列表，包括动态任务和静态任务。
 */
export const makeTaskInfoList = ({
  depositTaskInfo,
  tradeTaskInfo,
  learnInfo,
  redemptionLimit,
  currencyName,
}) => {
  // const {} = depositTaskInfo;
  // const {} = tradeTaskInfo;
  return [
    depositTaskInfo && {
      taskName: () => _t('6300fb53dcdc4000a058', { token: currencyName }),
      // desc: () => `每充值100 USDT等值的${currencyName}，可领取一次，每次最高可得50签`,
      type: TASK_ACTIVITY_TYPE.deposit,
      processComponent: DepositTaskProcess,
      bgIcon: depositIcon,
      info: depositTaskInfo,
    },
    tradeTaskInfo && {
      taskName: () => _t('307b3f48c3524000ae9b', { token: currencyName }),
      // desc: () => `每交易100 USDT等值的${currencyName}，可领取一次，每次最高可得50签`,
      type: TASK_ACTIVITY_TYPE.tradingReward,
      processComponent: TradeTaskProcess,
      bgIcon: tradeIcon,
      info: tradeTaskInfo,
    },
    {
      taskName: () => _t('ba36e5cace204000ae50'),
      desc: () => _t('008eaa8812f54000ad75'),
      type: TASK_ACTIVITY_TYPE.invitation,
      processComponent: InviteTaskProcess,
      bgIcon: inviteIcon,
    },
    {
      taskName: () => _t('13f92b7b02f24000ace3', { token: currencyName }),
      desc: () => _t('d0fd85c80a624000adbf', { x: redemptionLimit || 0 }),
      type: TASK_ACTIVITY_TYPE.signExchange,
      processComponent: ExchangeTaskProcess,
      bgIcon: exchangeIcon,
    },
    learnInfo && {
      taskName: () => _t('5d7ed3ef5da74000ac79', { num: learnInfo.params.learnMaxPoints }),
      desc: () => _t('a22d6beaf6a04000a601'),
      type: TASK_ACTIVITY_TYPE.learn,
      processComponent: LearnTaskProcess,
      bgIcon: learnIcon,
      info: learnInfo,
    },
  ].filter((i) => !!i);
};

/** 标题类型 */
export const TITLE_TYPE = {
  /** 自定义 */
  custom: 0,
  /** 内置 */
  preset: 1,
  /** 内置模版 */
  template: 2,
};
export const TASK_CATEGORY = {
  /** 充值任务 */
  cash: 'cash',
  /** 交易任务 */
  trade: 'trade',
};
