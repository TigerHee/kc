/**
 * Owner: mike@kupotech.com
 */
import { useState, useEffect, useRef } from 'react';
import {
  getDescriptor,
  validateBeforeFetchOverview,
  validateMinvestParams,
  getDescriptorKeysWatcher,
} from './components/InputSheet';
import { getMinInvest } from './model';
import Decimal from 'decimal.js/decimal';
import { div100 } from 'Bot/helper';
import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import pick from 'lodash/pick';
import { getOverviewInCreate } from 'Martingale/services';

const getOverview = debounce((args, next) => {
  args = { ...args };
  args.buyAfterFall = div100(args.buyAfterFall);
  args.stopProfitPercent = div100(args.stopProfitPercent);
  args.stopLossPercent = div100(args.stopLossPercent);
  // args.stopLossPrice = args.stopLossPrice;
  getOverviewInCreate(args).then(({ data }) => next(data?.orders ?? []));
}, 900);

/**
 * @description: 将止损价格线数据合并
 * @param {*} rawLineData
 * @param {*} formData
 * @param {*} symbolInfo
 * @return {*}
 */
const mergeLineData = (rawLineData = [], formData, symbolInfo) => {
  rawLineData = rawLineData.slice(0);
  const { stopLossPrice, stopLossPercent, price } = formData;
  if (stopLossPrice) {
    rawLineData.push({
      side: 'lossStopPrice',
      price:
        stopLossPrice ||
        Decimal(stopLossPercent)
          .div(100)
          .times(price)
          .toFixed(symbolInfo.pricePrecision, Decimal.ROUND_DOWN),
    });
  }
  return rawLineData;
};

/**
 * @description: 判断这三个参数是否发生变化, 变化了就请求最小投资额度接口
 * symbol, buyTimes, buyMultiple
 * @param {object} formData 本次的值
 * @param {object} lastTimeFormData 记录上次的值
 * @return {boolean}
 */
const isMinvestParamsChange = (formData = {}, lastTimeFormData = {}) => {
  const compareKeys = ['symbol', 'buyTimes', 'buyMultiple'];
  let compareGroupCurrent = pick(formData, compareKeys);
  let compareGroupLast = pick(lastTimeFormData, compareKeys);

  const balance = {};
  const descriptor = getDescriptor({ formData, balance });

  const typeTransformer = (descptor, data) => {
    Object.keys(data).forEach((key) => {
      if (descptor[key].type === 'string') {
        if (typeof data[key] !== 'string') {
          data[key] = String(data[key]);
        }
      } else if (descptor[key].type === 'number') {
        if (typeof data[key] !== 'number') {
          data[key] = Number(data[key]);
        }
      }
    });
    return data;
  };

  // 现将数据转换成相同的数据类型, 再比较
  compareGroupCurrent = typeTransformer(descriptor, compareGroupCurrent);
  compareGroupLast = typeTransformer(descriptor, compareGroupLast);

  return !isEqual(compareGroupCurrent, compareGroupLast);
};
/**
 * @description: 依赖变化, 发起获取最小投资额度/委托的请求
 * @return {*}
 */
export default ({ formData, balance, symbolInfo, setMergeState, form }) => {
  const [lineData, setData] = useState([]);
  const watcher = getDescriptorKeysWatcher({ formData, balance });
  const minvestParamsRef = useRef({
    symbol: formData.symbol,
    buyTimes: formData.buyTimes,
    buyMultiple: formData.buyMultiple,
  });
  useEffect(() => {
    // const validOverview = (minLimitAsset) =>
    //   validateBeforeFetchOverview({ formData, balance })
    //     .then(() => {
    //       let fetchLimitAsset = formData.limitAsset;
    //       if (formData.hasPrizeId) {
    //         // 体验金, 就直接用设置的值请求
    //         fetchLimitAsset = formData.limitAsset;
    //       } else {
    //         // 如果用户输入投资额不够, 就采用接口返回的最小投资额度
    //         // 或者用户没有输入
    //         // 或者用户输入的值小于此刻最新的最小投资额度
    //         // eslint-disable-next-line no-lonely-if
    //         if (
    //           Number(formData.limitAsset) > Number(balance.quotaAmount) ||
    //           !formData.limitAsset ||
    //           Number(formData.limitAsset) < Number(minLimitAsset)
    //         ) {
    //           fetchLimitAsset = minLimitAsset;
    //         }
    //       }

    //       let params = { ...formData, limitAsset: fetchLimitAsset };
    //       const descriptor = getDescriptor({ formData, balance: {} });
    //       // 过滤需要提交的参数
    //       params = pick(params, Object.keys(descriptor));

    //       try {
    //         getOverview(params, (data) => {
    //           if (!isEmpty(data)) {
    //             const sellOrder = data[data.length - 1];
    //             data = data.map((el) => {
    //               return {
    //                 price: el.buyPrice,
    //                 size: el.buySize,
    //                 side: 'buy',
    //               };
    //             });
    //             data.push({
    //               price: sellOrder.sellPrice,
    //               size: sellOrder.buySize,
    //               side: 'sell',
    //             });
    //             if (sellOrder.stopLossPrice) {
    //               data.push({
    //                 price: sellOrder.stopLossPrice,
    //                 side: 'lossStopPrice',
    //               });
    //             }
    //             setData(data);
    //           }
    //         });
    //       } catch (error) {
    //         console.log(error);
    //       }
    //     })
    //     .catch((res) => {
    //       setData([]);
    //     });

    // 影响最小投资额度的参数变化, 先请求最小投资额接口; 然后, 将返回值作为获取当前委托接口limitAsset的参数;
    // 不影响最小投资额度的参数变化, 可以直接把上次的最小投资额度作为获取当前委托接口limitAsset的参数;
    // 在没有选择体验金的情况下 走下面validateMinvestParams逻辑;
    // 有体验金, 投资额变化,就直接发起validOverview
    if (isMinvestParamsChange(formData, minvestParamsRef.current)) {
      validateMinvestParams({ formData, balance })
        .then(() => {
          // 防抖获取最小投资额度
          getMinInvest(formData, (minLimitAsset) => {
            if (minLimitAsset) {
              // 设置到数据中心
              setMergeState({ minLimitAsset });
              // 强制校验投资输入框
              const limitAsset = form.getFieldValue('limitAsset');
              // 强制重新校验
              limitAsset !== undefined && form.validateFields(['limitAsset']);
              // form.validateFields();
              // 在请求委托接口
              // validOverview(minLimitAsset);
            }
          });
        })
        .catch(() => {
          setData([]);
        })
        .finally(() => {
          // 保存本次的值
          minvestParamsRef.current = {
            symbol: formData.symbol,
            buyTimes: formData.buyTimes,
            buyMultiple: formData.buyMultiple,
          };
        });
    } else {
      // 在请求委托接口
      // validOverview(formData.minLimitAsset);
    }
  }, watcher);

  return mergeLineData(lineData, formData, symbolInfo);
};
