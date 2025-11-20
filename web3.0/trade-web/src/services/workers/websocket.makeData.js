/**
 * Owner: garuda@kupotech.com
 */
import { STATIC } from './websocket.const';
import { forEach } from './a.tiny.lodash';

let currentTime = null;

// 将XBT转换为BTC
function formatCurrency(currency) {
  if (currency === 'XBT') {
    return 'BTC';
  }
  return currency;
}

const makeActives = (activeOrders, updates) => {
  const connectOrders = [...activeOrders, ...updates];
  const allMap = {};
  let hasFullFill = false;
  let hasPartFill = false;
  forEach(connectOrders, (item) => {
    const { id, size, cancelSize = 0, dealSize = 0, type, orderTime } = item;
    const currentSize = Number(cancelSize) + Number(dealSize);
    const isRemove = currentSize >= size;
    if (type !== 'market') {
      // 完全成交
      if (dealSize === size) {
        hasFullFill = true;
        // 有dealSize 且 不是撤单情况
      } else if (Number(dealSize) > 0 && !isRemove) {
        hasPartFill = true;
      }
      if (isRemove) {
        delete allMap[id];
      } else {
        allMap[id] = { ...item, createdAt: Math.floor(orderTime / 1000000) };
      }
    }
  });
  const actives = Object.values(allMap).sort((a, b) => b.createdAt - a.createdAt);
  return { data: actives, hasFullFill, hasPartFill };
};

const makeActiveOrderData = (data, sendMessage, store) => {
  const { activeOrders } = store || {};
  if (data && data.length) {
    const updates = [];
    let updateSymbols = [];
    forEach(data, (item) => {
      // 合约全仓聚合订单变化的symbol
      if (item.topic !== '/trialContractMarket/userActiveOrder') {
        updateSymbols.push(item.data.symbol);
      }
      if (item.data && item.data.type !== 'market') {
        updates.push({
          ...item.data,
          isTrialFunds: item.topic === '/trialContractMarket/userActiveOrder',
        });
      }
    });

    updateSymbols = [...new Set(updateSymbols)];

    if (!updates || !updates.length) return;

    const makeData = makeActives(activeOrders, updates);

    sendMessage({
      method: STATIC.TOPIC_MESSAGE,
      type: STATIC.FUTURES_ACTIVE_ORDER,
      data: makeData,
    });
  }
};

const UPDATE_WALLET_SUBJECT = [
  'availableBalance.change',
  'orderMargin.change',
  'withdrawHold.change',
  'walletBalance.change',
];

/**
 * walletBalance.change 字段返回，全仓独有推送
 * "currency": "XBT",  //币种
 * "walletBalance": 2.002, //钱包余额
 * "availableBalance": 2.002, //可用余额
 * "holdBalance": 0, //冻结余额
 * =====
 * "isolatedOrderMargin": 0, //逐仓委托保证金
 * "isolatedPosMargin": 0, // 逐仓仓位保证包含逐仓资金费用
 * "isolatedUnPnl": 0, //逐仓未实现盈亏
 * "crossOrderMargin": 0,// 全仓订单委托保证金
 * "crossPosMargin": 0,// 全仓仓位保证金
 * "crossUnPnl": 0,// 全仓未实现盈亏
 * "equity": 2.002,// 权益
 * "totalCrossMargin": 2.002,// 全仓总保证金
 * "version": 9, // 版本，当持有全仓仓位时，同一版本号，可用余额会因为标记价格变化而变化，会出现同一版本号可用余额不一致情况
 * "timestamp": 1714632069838 // 最近变更时间
 */

const makeWalletData = (data, sendMessage, store) => {
  const { walletList = [] } = store || {};
  // 通过该标识判断是否需要拉取
  let needPullCost = false;
  if (!data || !data.length) return;
  // 根据 data 的 subject 为key 来组装数据
  const walletSubject = data.reduce((acc, { subject, data: itemData }) => {
    if (!acc[subject]) {
      acc[subject] = [];
    }
    // 如果是 walletBalance 变更，只取部分值，并且需要根据 version 判断只取最后一条
    if (subject === 'walletBalance.change') {
      const update = {
        margin: itemData.equity,
        availableBalance: itemData.availableBalance,
        version: itemData.version,
        walletBalance: itemData.walletBalance,
        totalMargin: itemData.totalCrossMargin,
        currency: itemData.currency,
        unrealisedPNL: Number(itemData.crossUnPnl) + Number(itemData.isolatedUnPnl),
      };
      if (!acc[subject].length) {
        acc[subject] = [update];
      } else if (acc[subject][0] && itemData.version - acc[subject][0].version >= 0) {
        acc[subject] = [update];
      }
      needPullCost = true;
    } else {
      acc[subject].push(itemData);
    }
    return acc;
  }, {});

  // 有3种 subject 类型，分别取最后一条，进行值的更新填充
  const updateObject = UPDATE_WALLET_SUBJECT.reduce((acc, key) => {
    const subject = walletSubject[key];
    if (subject) {
      const { currency, isTrialFunds = false, ...rest } = subject[subject.length - 1];
      const objKey = `${currency}_${!!isTrialFunds}`;
      acc[objKey] = { ...acc[objKey], currency, ...rest };
    }

    return acc;
  }, {});

  const updateWallets = [...walletList];

  Object.keys(updateObject).forEach((keys) => {
    // 这里 split 出来的 isTrialFunds 会是一个字符串，下面的判断都是用字符串来判断
    const [currency, isTrialFunds] = keys.split('_');
    // 判断更新的数据，是否携带体验金标识，如果携带，则寻找有体验金标识的数据进行更新
    const index = updateWallets.findIndex(
      ({ currency: itemCurrency, isTrialFunds: itemTrialFund = false }) => {
        return (
          formatCurrency(itemCurrency) === formatCurrency(currency) &&
          isTrialFunds === String(!!itemTrialFund)
        );
      },
    );
    if (index > -1) {
      // 全仓账务更新逻辑，需要根据 version 值来判断
      if (
        updateWallets[index] &&
        updateWallets[index].version &&
        updateObject[keys].version - updateWallets[index].version >= 0
      ) {
        const updateWallet = { ...updateWallets[index], ...updateObject[keys] };
        updateWallets[index] = updateWallet;
      } else {
        const updateWallet = { ...updateWallets[index], ...updateObject[keys] };
        updateWallets[index] = updateWallet;
      }
    }
  });

  sendMessage({
    method: STATIC.TOPIC_MESSAGE,
    type: STATIC.FUTURES_WALLET,
    data: { walletList: updateWallets, needPullCost },
  });
};

const makeCandleStick = (data, sendMessage) => {
  if (!data || !data.length) return;
  const stickData = {};
  forEach(data, ({ data: itemData }) => {
    const keys = itemData.symbol;
    if (!stickData[keys]) {
      stickData[keys] = [];
    }
    stickData[keys].push(itemData);
  });

  sendMessage({
    method: STATIC.TOPIC_MESSAGE,
    type: STATIC.FUTURES_CANDLE_STICK,
    data: stickData,
  });
};

const makeRecentDeal = (data, sendMessage) => {
  if (!data || !data.length) return;
  let updates = [];
  forEach(data, (item) => {
    if (item.data && item.data.ts > currentTime) {
      updates.push(item.data);
    }
  });
  if (updates && updates.length) {
    // 由于近期成交展示最新的一条，所以需要翻转一下数组
    updates = updates.reverse();
    currentTime = updates[0].ts;
  }

  sendMessage({
    method: STATIC.TOPIC_MESSAGE,
    type: STATIC.FUTURES_RECENT_DEAL,
    data: updates,
  });
};

const cancelStopOrder = (data, update) => {
  let { stopOrders = [] } = update;
  if (data.success) {
    stopOrders = stopOrders.filter((item) => item.id !== data.orderId);
  } else {
    stopOrders = stopOrders.filter((item) => {
      if (data.id) return item.id !== data.id;
      return item.id !== data.orderId;
    });
  }
  return { stopOrders };
};

const createStopOrder = (data, update) => {
  let { stopOrders } = update;
  // 创建普通条件委托
  stopOrders = [data, ...stopOrders];

  return { stopOrders };
};

const updateStopOrderSize = (data, update) => {
  let { stopOrders } = update;
  let isCancel = false;
  try {
    stopOrders.forEach((item) => {
      if (item.id === data.id) {
        let dataSize = data.size;
        // 增加条件单更新方向的判断
        if (item.side !== data.side) {
          dataSize = Number(item.size) - Number(data.size);
        }
        item.size = dataSize;
        if (item.size <= 0) {
          data.success = true;
          data.orderId = data.id;
          isCancel = true;
        }
      }
    });
  } catch (err) {
    //
  }
  if (isCancel) {
    stopOrders = cancelStopOrder(data, { stopOrders });
  }
  return { stopOrders };
};

const makeStopOrder = (data, sendMessage, store) => {
  let updateObject = { ...store };
  forEach(data, (item) => {
    const _data = { ...item.data, isTrialFunds: item.topic === '/trialContractMarket/stopOrder' };
    switch (item.subject) {
      case 'trade.stopOrderCancelled':
        // console.log('stopOrderCancel');
        updateObject = { ...updateObject, ...cancelStopOrder(_data, updateObject) };
        break;
      case 'trade.stopOrderCreated':
        // console.log('trade.stopOrderCreated');
        updateObject = { ...updateObject, ...createStopOrder(_data, updateObject) };
        break;
      case 'trade.stopOrderActive':
        // console.log('stopOrderActive');
        updateObject = {
          ...updateObject,
          ...cancelStopOrder(_data, updateObject),
          // 新增激活标识
          stopOrderActive: true,
        };
        break;
      case 'trade.stopOrderSizeUpdate':
        // console.log('stopOrderSizeUpdate');
        updateObject = { ...updateObject, ...updateStopOrderSize(_data, updateObject) };
        break;
      default:
        return true;
    }
  });
  // console.log('stop order update ---.');
  sendMessage({
    method: STATIC.TOPIC_MESSAGE,
    type: STATIC.FUTURES_STOP_ORDER,
    data: updateObject,
  });
};

const MAKE_DATA_FUNC = {
  [STATIC.FUTURES_ACTIVE_ORDER]: makeActiveOrderData,
  [STATIC.FUTURES_WALLET]: makeWalletData,
  [STATIC.FUTURES_CANDLE_STICK]: makeCandleStick,
  [STATIC.FUTURES_RECENT_DEAL]: makeRecentDeal,
  [STATIC.FUTURES_STOP_ORDER]: makeStopOrder,
  [STATIC.FUTURES_TRIAL]: makeWalletData,
};

export default MAKE_DATA_FUNC;
