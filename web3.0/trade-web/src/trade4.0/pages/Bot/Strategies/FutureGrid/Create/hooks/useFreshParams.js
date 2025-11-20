/**
 * Owner: mike@kupotech.com
 */
import React, { useState, useRef, useCallback } from 'react';
import useUpdateLayoutEffect from 'Bot/hooks/useUpdateLayoutEffect';
import useStateRef from '@/hooks/common/useStateRef';
import { getCalcParams } from '../../services';
import useCountDownTicker from 'Bot/hooks/useCountDownTicker';
import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';

// NOTICE: 古早代码
/**
 * @description: 检查changedParams是否有fields中的字段
 * @param {*} fields Array
 * @param {*} changedParams Object
 * @return {*} Boolean
 */
const hasFields = (fields, changedParams) => {
  return fields.some((field) => {
    return changedParams[field] !== undefined;
  });
};
/**
 * @description:
 * @param {*} form
 * @param {*} keys
 * @return {*}
 */
const checkNoErrors = (form, keys = []) => {
  return form.getFieldsError(keys).every((field) => isEmpty(field) || field?.errors.length === 0);
};
// 发起请求前 先校验合法性 较少不必要的请求
const validate = async ({ formRef, allParamsRef, changedParams = {}, mode }) => {
  // symbol, direction, leverage, lowerPrice, upperPrice, gridNum 参数都存在 才发起请求
  // limitAsset stopLossRatio 排除
  // 以changedParams优先级高， onChange触发可以最快获得最新的值， form要等一会才能拿到最新的值
  // 合并 复制一份
  const {
    symbol,
    direction,
    leverage,
    lowerPrice,
    upperPrice,
    gridNum,
    limitAsset,
    stopLossPrice,
    stopProfitPrice,
    openUnitPrice,
  } = { ...allParamsRef.current, ...changedParams };

  const form = formRef.current;
  // // 发送请求对象字段
  const submitParams = {};
  // 判断参数是否合格去发起请求
  // 必要参数
  // symbol, direction, leverage 这三个参数完整可以获取 initBlowUpPrice
  const isMustOk = [symbol, direction, leverage].every((el) => !!el);
  if (isMustOk) {
    Object.assign(submitParams, {
      symbol,
      direction,
      leverage,
    });
  }

  // 其余三个参数
  // 这三个参数加上上面的三个参数 可以获取 网格间距，利润
  const isOtherHasFill = [lowerPrice, upperPrice, gridNum].every((el) => !!el);
  const isOtherFormNoErrs = checkNoErrors(form, ['lowerPrice', 'upperPrice', 'gridNum']);
  const isOtherOk = isOtherHasFill && isOtherFormNoErrs;
  if (isOtherOk) {
    Object.assign(submitParams, {
      lowerPrice,
      upperPrice,
      gridNum,
    });
  }

  // 投资额度
  const isInverstNoErrs = checkNoErrors(form, ['limitAsset']);
  const isInverstOk = limitAsset && isInverstNoErrs;
  if (isInverstOk) {
    Object.assign(submitParams, {
      limitAsset,
    });
  }

  // 止损价 可以设置为空
  const isStopLossPriceNoErrs = checkNoErrors(form, ['stopLossPrice']);
  if (isStopLossPriceNoErrs) {
    Object.assign(submitParams, {
      stopLossPrice,
    });
  }
  const isStopProfitPriceNoErrs = checkNoErrors(form, ['stopProfitPrice']);
  if (isStopProfitPriceNoErrs) {
    Object.assign(submitParams, {
      stopProfitPrice,
    });
  }
  // 触发开单价 可以设置为空
  const isOpenPriceNoErrs = checkNoErrors(form, ['openUnitPrice']);
  if (isOpenPriceNoErrs) {
    Object.assign(submitParams, {
      openUnitPrice,
    });
  }
  // 刷新模式的情况触发
  // 这是一个定时任务
  if (mode === 'fresh') {
    // 交易对方向杠杆、区间网格 确定之后 才开启刷新
    if (isMustOk && isOtherOk) {
      return submitParams;
    }
  } else if (!isMustOk) {
    return;
    // 手动修改输入框模式
    // if (!isMustOk) {
    //   return;
    // }
    // 1.交易对、方向、杠杆 变化需要直接发起请求
    // 2.价格区间、网格 三个参数合格才发起请求
  }
  // 之所以划分区域是因为 参数从上到下，是要先填写了上面的参数才能计算相应的参数， 直接填写下面的参数上面没有填写，请求无意义
  // 页面分为5个区域(交易对方向杠杆、区间网格、投资额、止损、止盈)手动触发

  switch (true) {
    case hasFields(['symbol', 'direction', 'leverage'], changedParams):
      if (isMustOk) {
        return submitParams;
      }
      break;
    case hasFields(['lowerPrice', 'upperPrice', 'gridNum'], changedParams):
      if (isMustOk && isOtherOk) {
        return submitParams;
      }
      break;
    case hasFields(['limitAsset'], changedParams):
      if (isMustOk && isOtherOk && isInverstOk) {
        return submitParams;
      }
      break;
    case hasFields(['stopLossPrice'], changedParams):
      if (isMustOk && isOtherOk && isInverstOk && isStopLossPriceNoErrs) {
        return submitParams;
      }
      break;
    case hasFields(['stopProfitPrice'], changedParams):
      if (isMustOk && isOtherOk && isInverstOk && isStopProfitPriceNoErrs) {
        return submitParams;
      }
      break;
    case hasFields(['openUnitPrice'], changedParams):
      if (isMustOk && isOtherOk && isInverstOk && isOpenPriceNoErrs) {
        return submitParams;
      }
      break;
    default:
      return null;
  }
};
const initParams = {
  initBlowUpPrice: 0, // 区间限制价格
  blowUpPrice: 0, // 爆仓价
  diff: 0,
  isNotice: false,
  feeRatio: 0,
  gridProfitLowerRatio: 0,
  gridProfitUpperRatio: 0,
  minAmount: 0, // 交易对方向杠杆、区间网格填写之后可以计算出的参数
  realMinAmount: 0, // 后端后来加的补救参数
  stopLossRatio: 0, // 止损比例
  entryContractNum: 0, // 开仓数量
  maxInvestment: 0, // 交易对 选了杠杆倍数后
  multiplier: 0.001,
};
// 过滤掉多余的字段
const filterEffectiveRelatedParams = (data) => {
  const relatedParams = {};
  Object.keys(initParams).forEach((field) => {
    relatedParams[field] = data[field];
  });
  return relatedParams;
};

// 交易对方向杠杆 ==> initBlowUpPrice（区间价格限制）,maxInvestment（最大投资额度）
const useFreshParams = (form, allParamsRef, isActive) => {
  // 实时获取依赖的参数
  const [relatedParams, setRelatedParams] = useState(initParams);

  // 具有限流 请求成功后会开启10s定时刷新
  const getCalcParamsRef = useRef(
    debounce((allSubmitParams) => {
      getCalcParams({ ...allSubmitParams }).then(({ data }) => {
        setRelatedParams(filterEffectiveRelatedParams(data));
        // 每次这个接口请求后，倒计时10s后，就会重新自动发起一个请求，保证参数最新
        // 如果10s内再次触发，就会清空定时器
        // 自动刷的机制，设置了最大刷新次数，超过就不触发了
        startCountDownTickerCallbackRef.current('fresh', {});
      });
    }, 1000),
  );
  // 交易对变化重置relatedParams
  useUpdateLayoutEffect(() => {
    setRelatedParams(initParams);
  }, [allParamsRef.current.symbol]);

  const formRef = useStateRef(form);
  const validateFreshRef = useRef();

  validateFreshRef.current = useCallback((mode, changedParams) => {
    validate({ formRef, allParamsRef, changedParams, mode }).then((allSubmitParams) => {
      allSubmitParams && getCalcParamsRef.current(allSubmitParams);
    });
  }, []);
  // 值变化触发请求
  // useDeepCompareEffect(() => {
  //   validateFreshRef.current();
  // }, [allParamsRef.current]);

  // 10s 自动刷新逻辑 ----
  // 这个属于递归式循环刷新接口
  const startCountDownTickerCallbackRef = useCountDownTicker(validateFreshRef, isActive);
  // 10s 自动刷新逻辑 ----

  return {
    relatedParams,
    setRelatedParams: (data) => setRelatedParams(filterEffectiveRelatedParams(data)),
    validateFreshRef,
  };
};

export default useFreshParams;
