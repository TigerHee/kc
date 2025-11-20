/**
 * Owner: mike@kupotech.com
 */
import { strasMap } from 'Bot/config';
import { _t } from 'Bot/utils/lang';

// 智能持仓当做运行处理展示
export const seeAsRunning = [
  'GRID_STAY_ORDER',
  'RUNNING',
  'POSITION_CHANGING',
  'UPDATING',
];

// 亏损1/1000之内 都显示0；
const processItem = (item) => {
  item.totalProfit = +item.totalProfit;
  item.totalCost = +item.totalCost;
  item.strategyProfit = +item.strategyProfit;
  item.yearProfitRate = +item.yearProfitRate;
  // 年华负数不显示
  if (item.yearProfitRate < 0) {
    item.yearProfitRate = null;
  }
  // 有网格利润直接显示
  if (item.strategyProfit > 0) {
    return item;
  }
  // 没有网格利润，走总利润的是-的投资额度的1/1000
  if (
    item.totalProfit < 0 &&
    item.totalProfit >= (-1 / 1000) * item.totalCost
  ) {
    item.totalProfit = 0;
    item.totalProfitRate = 0;
    item.strategyProfit = 0;
    item.strategyProfitRate = 0;
    item.floatingAmount = 0;
    item.yearProfitRate = 0;
    item.floatingAmountRate = 0;
  }

  return item;
};

// 所有运行列表需要经过这个处理函数
export const filterRunningLists = (lists) => {
  // 后端异常，可以会有id为空的情况
  const effective = lists.filter((el) => el.id && strasMap.get(el.type));
  effective.forEach((el) => {
    // 账户冻结 ACCOUNT_FROZEN 当成 RUNNING
    if (el.status === 'ACCOUNT_FROZEN') {
      el.status = 'RUNNING';
    }
    // 处理name ,没有就设置默认的
    if (!el.name) {
      el.name = _t(strasMap.get(el.type)?.lang);
    }
    // 触发开单价状态 后端没有做对应状态 前端设置
    if (
      el.status === 'WAIT_OPEN_UNIT_PRICE' ||
      (Number(el.openUnitPrice) !== 0 && !el.isOpenUnit)
    ) {
      el.status = 'WAIT_OPEN_UNIT_PRICE';
    }
    if (el.status === 'RUNNING') {
      el = processItem(el);
    }

  });
  return effective;
};

// RISK_PROTECTION 合约触发风险限额
export const effectiveRunningStatus = [
  'WAIT_OPENUNITPRICE',
  'RUNNING',
  'STOPPING',
  'RISK_PROTECTION',
  'PAUSED', // 现货网格暂停中
  ...seeAsRunning, // 持仓中的状态
];
// 必须经过上面函数的调用之后使用
export const calcRunningNum = (runningLists = []) => {
  return runningLists.filter((task) => {
    return effectiveRunningStatus.includes(task.status);
  }).length;
};
