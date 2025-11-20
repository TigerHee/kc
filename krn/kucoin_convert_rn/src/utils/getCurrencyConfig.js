/**
 * Owner: willen@kupotech.com
 */

const U = 'USDT';
/** 是U,用对手币种去换
 * BTC -USDT, BTC 直接取normalCurrencyLimitMap， 用BTC到usdtCurrencyLimitMap拿USDT的配置
 * @description:
 * @param {coin} from
 * @param {coin} to
 * @param {coinMap} coinMap
 * @param {enum} orderType
 * @return {object}
 */
const getCurrencyConfig = ({from, to, coinMap = {}, orderType}) => {
  if (!from || !to || from === to) {
    return {
      from: undefined,
      to: undefined,
    };
  }

  const usdtMap = coinMap?.usdtCurrencyLimitMap || {};
  const normalMap = coinMap?.normalCurrencyLimitMap || {};

  // 限价 需要校验合法性
  if (orderType === 'LIMIT') {
    const valid = getValidUPair(from, to);
    from = valid.from;
    to = valid.to;
  }

  if (![from, to].includes(U)) {
    return {
      from: normalMap[from],
      to: normalMap[to],
    };
  }
  if (from === U) {
    return {
      from: usdtMap[to],
      to: normalMap[to],
    };
  }
  if (to === U) {
    return {
      from: normalMap[from],
      to: usdtMap[from],
    };
  }
};

/**
 * @description: 从市价切换到限价，需要校验币种是否含U, 没有，则将to设置为U
 * @param {*} from
 * @param {*} to
 * @return {*}
 */
export const getValidUPair = (from, to) => {
  if ([from, to].includes(U)) return {from, to};
  return {
    from,
    to: U,
  };
};
export default getCurrencyConfig;
