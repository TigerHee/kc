/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { nextTick } from '../util';
import AsyncValidator from 'async-validator';
import Decimal from 'decimal.js/decimal';
import { getInputMaxInvestPrecision } from 'FutureMartingale/config';
import { postMinInvest, preComputeOrders } from 'FutureMartingale/services';
import { isNull, div100, formatNumber } from 'Bot/helper';
import debounce from 'lodash/debounce';
import { _t } from 'Bot/utils/lang';

/**
 * @description: 从对象中删除field
 * @param {*} obj
 * @param {*} field
 * @return {*}
 */
const purifyFields = (obj, field) => {
  const newObj = { ...obj };
  if (field in newObj) {
    delete newObj[field];
  }
  return newObj;
};

const createDescriptor = ({ formData, balance }) => {
  const descriptor = {
    symbol: {
      required: true,
    },
    direction: {
      required: true,
    },
    leverage: {
      required: true,
      type: 'number',
    },
    buyAfterFall: {
      required: true,
      type: 'number',
      min: +formData.minBuyAfterFall,
      max: +formData.maxBuyAfterFall,
      submitFormat: val => div100(val), // 提交的格式
    },
    buyTimes: {
      required: true,
      type: 'number',
      min: +formData.minBuyTimes,
      max: +formData.maxBuyTimes,
    },
    buyMultiple: {
      required: true,
      type: 'number',
      min: +formData.minBuyMultiple,
      max: +formData.maxBuyMultiple,
    },
    limitAsset: {
      required: false,
      type: 'number',
      min: +Math.max(formData.defaultLimitAsset || 0, formData.minLimitAsset || 0),
      max: Math.min(formData.maxLimitAsset, balance.quotaAmount),
      validator: (rule, value, cb) => {
        if (!isNull(value) && +value > 0) {
          value = Number(value);
          const max = +rule.max;
          const min = +rule.min;
          // 输入小于最小投资额
          if (value < min) {
            return cb(_t('gridform32', { min, quota: 'USDT' }));
          }

          if (value > balance.quotaAmount) {
            return cb(_t('gridform31'));
          }
          if (value > max) {
            return cb(_t('futrgrid.maxinput', { max: `${formatNumber(max) } USDT` }));
          }
        }
        cb();
      },
    },
    openUnitPrice: {
      required: false,
      type: 'number',
      min: 0,
    },
    // stopLossPercent: {
    //   required: false,
    //   type: 'number',
    //   min: 0
    // }

    // minPrice: {
    //   required: false,
    //   type: 'number',
    //   min: 0
    // },
    // maxPrice: {
    //   required: false,
    //   type: 'number',
    //   min: 0
    // },
  };
  return descriptor;
};

const getMustFillParamsValue = allParams => {
  const descriptor = createDescriptor({ formData: {}, balance: {} });
  const mustFillParamsKeys = Object.keys(descriptor);
  const value = {};
  mustFillParamsKeys.forEach(key => {
    if (descriptor[key].submitFormat) {
      value[key] = descriptor[key].submitFormat(allParams[key]);
    } else {
      value[key] = allParams[key];
    }
  });
  return value;
};
/**
 * @description: 获取最小投资额 限制
 * @param {*} mustFillParams
 * @return {*}
 */
export const getMinInvestBase = async (allParams, precision) => {
  const mustFillParams = getMustFillParamsValue(allParams);
  const { buyTimes, buyMultiple, symbol, direction, buyAfterFall } = mustFillParams;
  try {
    if (
      Number(buyTimes) > 0 &&
      Number(buyMultiple) > 0 &&
      Number(buyAfterFall) > 0 &&
      symbol &&
      direction
    ) {
      const result = await postMinInvest(mustFillParams);
      if (result.data) {
        return {
          minLimitAsset: Decimal(result.data.minInvestment).toFixed(
            getInputMaxInvestPrecision(precision),
            Decimal.ROUND_UP,
          ),
          blowUpPrice: result.data.blowUpPrice,
        };
      }
    }
  } catch (error) {
    return null;
  }
};

/**
 * @description: 防抖获取最小投资额度限制
 * @param {*} dataRef 数据ref
 * @param {*} setMergeState 更新函数
 * @param {*} form 表单
 * @return {*}
 */
export const getMinInvest = debounce(
  async ({ allFormData, setMergeState, form, precision }, next) => {
    try {
      // 始终拿到最新值
      const minInvestData = await getMinInvestBase(allFormData, precision);
      if (minInvestData) {
        setMergeState(minInvestData);
        nextTick(() => {
          // 强制校验投资输入框
          const limitAsset = form.getFieldValue('limitAsset');
          // 强制重新校验
          limitAsset !== undefined && form.validateFields(['limitAsset']);

          // form.validateFields();
        });
        next && next({ ...allFormData, ...minInvestData });
      }
    } catch (error) {
      console.log(error);
    }
  },
  1000,
);

const validate = ({ formData, balance }) => {
  const descriptor = createDescriptor({ formData, balance });
  const schema = new AsyncValidator(descriptor);
  return schema.validate(formData, { suppressWarning: true });
};

const getWatchKeys = ({ formData, balance }) => {
  const descriptor = createDescriptor({ formData, balance });
  const newFormData = { ...formData };
  const keys = Object.keys(descriptor).map(key => {
    newFormData[key] = descriptor[key].type === 'number' ? Number(formData[key]) : formData[key];
    return newFormData[key];
  });
  return {
    keys,
    newFormData,
  };
};

const mapField = args => {
  const params = {
    direction: args.direction,
    leverage: args.leverage,
    symbol: args.symbol,
    takeProfitPercent: div100(args.stopProfitPercent),
    maxOpenTimes: args.buyTimes,
    openAfterFall: div100(args.buyAfterFall),
    openMultiple: args.buyMultiple,
    investmentValue: args.investmentValue,
    openPrice: args.openUnitPrice ? args.openUnitPrice : null,
    maxPrice: args.maxPrice,
    minPrice: args.minPrice,
    stopLossPercent: args.stopLossPercent ? div100(args.stopLossPercent) : null,
    TOAST_NO: true, // 不需要toast提示
  };

  return params;
};
export const getOverview = debounce(({ formData, balance }, callback) => {
  let investmentValue = 0;
  if (formData.hasPrizeId) {
    // 体验金, 就直接用设置的值请求
    investmentValue = formData.limitAsset;
  } else {
    // 其他情况下直接用接口返回的最小投资额
    investmentValue = formData.limitAsset;
    // 如果用户输入投资额不够, 就采用接口返回的最小投资额度
    // 或者用户没有输入
    // 或者用户输入的值小于此刻最新的最小投资额度
    if (
      Number(formData.limitAsset) > Number(balance.quotaAmount) ||
      !formData.limitAsset ||
      Number(formData.limitAsset) < Number(formData.minLimitAsset)
    ) {
      investmentValue = formData.minLimitAsset;
    }
  }

  if (investmentValue) {
    preComputeOrders(mapField({ ...formData, investmentValue })).then(({ data }) => {
      callback(data ?? []);
    });
  }
}, 900);

/**
 * @description: 监听数据字段的变化, 且判断数据字段合法的情况下,在发起请求
 * 先请求okHandler, 得到的返回值,载传递给overviewHandler作为请求参数
 * @return {*}
 */
export default ({ allFormData: formData, balance }, okHandler, overviewHandler, errorHandler) => {
  const { keys, newFormData } = getWatchKeys({ formData, balance });
  // 这些值变化,先请求获取最小投资额度的接口;然后,再请求获取当前委托的接口;
  React.useEffect(() => {
    validate({ formData: newFormData, balance })
      .then(() => {
        okHandler(newFormData, overviewHandler);
      })
      .catch(error => {
        // 如果错误只有钱不够, 就清空这个字段发起接口
        if (error.errors.length === 1 && error.fields.limitAsset) {
          okHandler(purifyFields(newFormData, 'limitAsset'), overviewHandler);
        } else {
          errorHandler();
        }
      });
  }, keys);
  // 这些值变化,需要校验整个表单,然后发起请求委托的接口
  // const { maxPrice, minPrice, stopProfitPercent, stopLossPercent } = formData;
  // React.useEffect(() => {
  //   validate({ formData: newFormData, balance })
  //     .then(() => {
  //       overviewHandler(formData);
  //     })
  //     .catch(error => {
  //       // 如果错误只有钱不够, 就清空这个字段发起接口
  //       if (error.errors.length === 1 && error.fields.limitAsset) {
  //         overviewHandler(formData);
  //       } else {
  //         errorHandler();
  //       }
  //     });
  // }, [maxPrice, minPrice, stopProfitPercent, stopLossPercent]);
};

/**
 * @description: 将接口中的lineData和 blowUpPrice, lossStopPice合并, 丢给图表绘制价格线
 * @param {object} formData
 * @param {object} symbolInfo
 * @return {array}
 */
export const mergeLineData = (formData = {}, symbolInfo) => {
  const { rawLineData = [], blowUpPrice, stopLossPercent, direction } = formData;

  const lineData = [];
  if (rawLineData?.length) {
    rawLineData.forEach(el => {
      lineData.push({
        price: el.openPrice,
        size: el.openSize,
        side: direction === 'long' ? 'buy' : 'sell',
      });
    });
    const lastOrder = rawLineData[rawLineData.length - 1];
    lineData.push({
      price: lastOrder.reducePrice,
      size: lastOrder.openSize,
      side: direction === 'long' ? 'sell' : 'buy',
    });
    if (stopLossPercent && lastOrder.stopLossPrice) {
      lineData.push({
        // 页面设置的止损百分比
        side: 'lossStopPrice',
        price: Decimal(lastOrder.stopLossPrice).toFixed(symbolInfo.precision, Decimal.ROUND_DOWN),
      });
    }
  }

  if (blowUpPrice) {
    lineData.push({
      side: 'blowUpPrice',
      price: Number(blowUpPrice),
    });
  }

  return lineData;
};
