/**
 * Owner: mike@kupotech.com
 */
import { _t, _tHTML } from 'Bot/utils/lang';
import Storage from 'utils/storage';
import Decimal from 'decimal.js';
import { times100, div100, getAvailLang } from 'Bot/helper';
import DialogRef from 'Bot/components/Common/DialogRef';
import { dropNull } from './util';
import { getStore } from 'src/utils/createApp';

export const maxInversment = 10000; // 最大投资额度
export const minInvestment = 40; // 最小投资额度
export const mostCoinNum = 12; // 最多选择的币种
export const maxAutoSell = 100000; // 自动卖出的最大投资额度

export const minTransfer = 40; // 转入转出最小usdt
export const tranPrecision = 8; // 转入转出的精度
export const minPercent = 1; // 最小币种百分比
export const symbolInfo = {
  // 拼凑持仓交易对信息
  symbolCode: '',
  basePrecision: 3,
  pricePrecision: 3,
  quotaPrecision: 3,
  base: '',
  quota: 'USDT',
};

export const thresholdOptionsCacheKey = 'smarttrade_ajustway_v2';
// 基础公式：
// 币种<=6,最低投资额为40U
// >6，每增加一个币种最小投资额+100U
// 额外公式:
// 组合中最大下单金额*200
// 最低投资额 =Max(基础公式，额外公式)

const calcMinInverstmentByCoinNum = (coinNum) => {
  coinNum = +coinNum;
  return coinNum <= 6 ? minInvestment : (coinNum - 6) * 100 + minInvestment;
};

/**
 * @description: 计算最小投资额度
 * @param {*} selectedCoinsNum 已选币种数量
 * @param {*} coins 币种对应的服务器信息
 * @return {*}
 */
export const calcMinInverstment = (selectedCoinsNum, coins) => {
  let maxBaseMinSize = 0;
  const baseMinSizeArr = coins.map((cn) => {
    const nowBaseMinSize = Number(
      Decimal(cn.baseMinSize).times(cn.usdtPrice).toFixed(8, Decimal.ROUND_DOWN),
    );
    if (nowBaseMinSize > maxBaseMinSize) {
      maxBaseMinSize = nowBaseMinSize;
    }
    return {
      currency: cn.code,
      minInverstment: nowBaseMinSize,
    };
  });

  // 基础公式:
  // 币种<=6,最低投资额为40U
  // >6，每增加一个币种最小投资额+100U
  const baseMinInverstmentSize = calcMinInverstmentByCoinNum(selectedCoinsNum);

  // 额外公式:
  // 组合中最大下单金额*200
  const maxOrderSize = Math.ceil(Decimal(maxBaseMinSize).times(200).toNumber());

  return {
    minInvestment: Math.max(baseMinInverstmentSize, maxOrderSize), // 最低投资额 =Max(基础公式，额外公式)
    baseMinSizeArr,
  };
};

const defaultThreshold = { threshold: 0.01 };
// 提交数据格式
export const submitData = (options) => {
  return {
    templateId: options.templateId,
    followTaskId: options.followTaskId,
    couponId: options.coupon?.id,
    positionTemplateId: options.positionTemplateId,
    params: [
      {
        code: 'change',
        value: JSON.stringify({
          targets: options.coins.map((coin) => {
            const temp = {
              currency: coin.currency,
              percent: div100(coin.value),
            };
            if (coin.triggerPrice) {
              temp.triggerPrice = coin.triggerPrice;
            }
            return temp;
          }),
          method: options.method ? dropNull(options.method) : defaultThreshold,
          investments: options.investments,
          totalInvestmentUsdt: options.limitAsset,
          ...options.lossProfit,
        }),
      },
      {
        code: 'createEntrance',
        value: options.createEntrance || 'otherCreate',
      },
      {
        code: 'createWay',
        value: options.createWay,
      },
    ],
  };
};

// 确认下单变化
export const sureSubmitData = (options) => {
  return {
    investments: options.investments,
    method: options.method ? dropNull(options.method) : defaultThreshold,
    targets: options.coins.map((coin) => {
      const temp = {
        currency: coin.currency,
        percent: div100(coin.value),
      };
      if (coin.triggerPrice) {
        temp.triggerPrice = coin.triggerPrice;
      }
      return temp;
    }),
    totalInvestmentUsdt: options.limitAsset,
    useMultipleInvestment: options.useOtherCoins,
  };
};

// 调仓时间间隔排序
// S M H D
export const sortInterval = (options) => {
  const sorter = ['S', 'M', 'H', 'D'];
  const catMap = {};
  // 分类
  options.forEach((el) => {
    const [, unit] = el.split(/(?=S|M|H|D)/);
    if (!catMap[unit]) {
      catMap[unit] = [];
    }
    catMap[unit].push(el);
  });
  // 再把每个分类的数据在次从小到大排序
  for (const cat in catMap) {
    if (Object.prototype.hasOwnProperty.call(catMap, cat)) {
      catMap[cat].sort((a, b) => {
        return Number(a.replace(/(S|M|H|D)$/, '')) - Number(b.replace(/(S|M|H|D)$/, ''));
      });
    }
  }
  let newOptions = [];
  sorter.forEach((cat) => {
    if (catMap[cat]) {
      newOptions = newOptions.concat(catMap[cat]);
    }
  });

  return newOptions;
};
// 调仓阈值转换 将2D 类 转换成对应的语言显示
export const adjustLimitConfiger = (el) => {
  const [Num, unit] = el.split(/(?=S|M|H|D)/);
  const num = +Num;
  const config = {
    S: {
      text: () => _t('smart.ordersecondstime', { hour: num }),
      seconds: num,
    },
    M: {
      text: () => _t('smart.orderminitustime', { hour: num }),
      seconds: num * 60,
    },
    H: {
      text: () => _t(`auto.orderhourtime${num > 1 ? '2' : ''}`, { hour: num }),
      seconds: num * 60 * 60,
    },
    D: {
      text: () => _t(`auto.orderdaytime${num > 1 ? '2' : ''}`, { hour: num }),
      seconds: num * 60 * 60 * 24,
    },
  };
  return config[unit];
};

// 根据调仓的阈值/时间 转换成界面显示的文字
export const getShowTextByLimit = ({ threshold, interval }) => {
  const adjustWays = getStore().getState()?.smarttrade?.adjustWays;
  if (adjustWays) {
    const { thresholdOptions, intervalOptions } = adjustWays;
    if (threshold && thresholdOptions) {
      return thresholdOptions.find((el) => el.value === threshold)?.text ?? threshold;
    }
    if (interval && intervalOptions) {
      return intervalOptions.find((el) => el.value === interval)?.text() ?? interval;
    }
  }
  return '';
};

// 展示成 调仓阈值5%/调仓时间
export const getLimitTextByMethod = ({ autoChange, threshold, interval }) => {
  // 显示关闭
  if (autoChange === false) {
    return _t('disabled');
  }
  // 有调仓值
  if (threshold) {
    return `${_t('smart.byyuzhi2')} ${times100(threshold)}%`;
  } else if (interval) {
    return `${_t('smart.bytime2')} ${getShowTextByLimit({ interval })}`;
  }
  return null;
};

// 全部 稳健型 激进型 进取型
export const smartType = [
  {
    value: 0,
    text: 'allsymbol',
    color: null,
  },
  {
    value: 1,
    text: 'smart.allsymbol2', // 稳健性
    color: '#2DBD96',
  },
  {
    value: 2,
    text: 'smart.allsymbol3', // 激进性
    color: '#928EF4',
  },
  {
    value: 3,
    text: 'smart.jinquxing', // 进取性
    color: '#EDB66E',
  },
];

// 使用教程跳转地址
const toturial = {
  'en-US': '/support/4402754496537--Smart-Rebalance-KuCoin-Trading-Bot-Tutorial',
  'zh-CN': `/zh-hans/support/4402754496537--%E6%99%BA%E8%83%BD%E6%8C%81%E4%BB%9
    3-%E5%9B%BE%E6%96%87%E6%93%8D%E4%BD%9C%E6%95%99%E7%A8%8B`,
};

export const jumpTotorial = () => {
  return toturial[getAvailLang()];
};
// 文章教程 视频教程
export const toturialCfg = {
  articleSrc: jumpTotorial(),
  videoSrc: null,
};
/**
 * @description: 通过币种从dva中批量获取账户的余额
 * @param {Boolean} useOtherCoins 是否使用多币种
 * @param {Array} coins 币种信息
 * @param {Object} position 币币资产map
 * @return {*}
 */
export const getBalanceByCurrency = ({ useOtherCoins, coins = [], position = {} }) => {
  let currencyArr = useOtherCoins ? ['USDT', ...coins.map((el) => el.currency)] : ['USDT'];
  let totalSum = 0;
  currencyArr = currencyArr
    .map((currency) => {
      const target = position[currency];
      if (target) {
        const availableBalance = target?.availableBalance || 0;
        totalSum = Decimal(totalSum).add(availableBalance);
        return {
          ...target,
          availableBalance,
        };
      }
      return null;
    })
    .filter((el) => el)
    .sort((a, b) => b.availableBalance - a.availableBalance); // 大到小排列
  return {
    sumInUsdt: totalSum.valueOf(),
    currentAccountList: currencyArr,
  };
};

/**
 * @description: 展示不支持大额10w卖出
 * @param {*} contentKey
 * @param {*} rate
 * @return {*}
 */
export const showNotSupportBigSell = ({ contentKey, rate }) => {
  DialogRef.info({
    title: _t('goodhint'),
    content: _tHTML(contentKey, {
      rate: `${rate}%`,
    }),
    okText: _t('gridform24'),
    cancelText: null,
  });
};

/**
 * @description: 构造change 数据， data 中的percent是 小数， coins 中的value是乘以了100， 这个函数和diffChange差不多
 * @param {Array} snapshots 当前持仓
 * @param {Array} targets 目标持仓
 * @return {Array}
 */
export const composeChange = (snapshots = [], targets = [], valueKey = 'value') => {
  const snapshotsMap = {};
  snapshots.forEach((el) => {
    snapshotsMap[el.currency] = el;
  });

  const change = [];
  // 按照目标组建数据
  // 包含持仓中和投资中有共同的
  targets.forEach((coin) => {
    if (snapshotsMap[coin.currency]) {
      const before = Decimal(snapshotsMap[coin.currency].percent).times(100).toNumber();
      change.push({
        triggerPrice: coin.triggerPrice,
        base: coin.currency,
        before,
        after: coin[valueKey],
        changer: Number(coin[valueKey]) - before,
      });
      // 组建数据之后删除
      delete snapshotsMap[coin.currency];
    } else {
      change.push({
        triggerPrice: coin.triggerPrice,
        base: coin.currency,
        before: 0,
        after: coin[valueKey],
        changer: coin[valueKey],
      });
    }
  });
  // snapshotsMap如果还有剩余的,也一道合并进来, 放在第一位置
  //  这种情况 是持仓中不含有, 那边after就为0
  if (Object.keys(snapshotsMap).length) {
    for (const key in snapshotsMap) {
      if (Object.prototype.hasOwnProperty.call(snapshotsMap, key)) {
        const coin = snapshotsMap[key];
        const before = Decimal(coin.percent).times(100).toNumber();
        change.unshift({
          triggerPrice: coin.triggerPrice,
          base: key,
          before,
          after: 0,
          changer: -before,
        });
      }
    }
  }

  return change;
};

/**
 * @description: 从currencyInfo过滤出targets
 * @param {*} currencyInfo
 * @return {*}
 */
export const filterTargets = (currencyInfo = []) => {
  return (
    currencyInfo
      ?.map((row) => {
        let target = row.target;
        if (target) {
          target = { ...target };
          // 本地使用value表示百分比
          target.value = times100(target.percent);
          target.percent = target.value;
        }
        return target;
      })
      ?.filter((target) => target) || []
  );
};
export const colors = [
  '#1DB491',
  '#4186E2',
  '#704ED2',
  '#8879FF',
  '#49FFA1',
  '#69D5FF',
  '#F5CE63',
  '#597094',
  '#B2F0D9',
  '#1D9190',
  '#B4C761',
  '#C0C7D6',
  '#226D8F',
];
