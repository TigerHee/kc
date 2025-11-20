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
const validate = ({ formRef, allParamsRef, changedParams = {}, mode }) => {
  // symbol, direction, leverage 交易对和方向和杠杆倍数都存在才可以发送请求，这个时候可以获取到获取爆仓价,利用爆仓价可以得到上下限
  // 做空：后端返回上限 up < blowUpPrice
  // 做多：后端返回下限 down > blowUpPrice
  // 有了上下限 会有挂单数量
  // 网格间距和卖单利润是根据价格区间和挂单数量决定的,没有的话清空
  // 投资额变化了，去获取借入数量等下等东西
  // symbol, direction, leverage, lowerPrice, upperPrice, gridNum 参数都存在 才发起请求
  // limitAsset stopLossRatio 排除
  // 以params优先级高， onChange触发可以最快获得最新的值， form要等一会才能拿到最新的值
  // 合并 复制一份
  const { symbol, direction, leverage, down, up, gridNum, limitAsset } = {
    ...allParamsRef.current,
    ...changedParams,
  };

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

  // 区间上下限填写正确可以得到最大挂单数量上限，下限都为2
  const isRangeHasFill = [down, up].every((el) => !!el);
  const isRangeFormNoErrs = checkNoErrors(form, ['down', 'up']);
  const isRangeOk = isRangeHasFill && isRangeFormNoErrs;
  if (isRangeOk) {
    Object.assign(submitParams, {
      down,
      up,
    });
  }
  // 其余三个参数
  // 这三个参数加上上面的三个参数 可以获取 网格间距，利润
  const isOtherHasFill = [down, up, gridNum].every((el) => !!el);
  const isOtherFormNoErrs = checkNoErrors(form, ['down', 'up', 'gridNum']);
  const isOtherOk = isOtherHasFill && isOtherFormNoErrs;
  if (isOtherOk) {
    Object.assign(submitParams, {
      down,
      up,
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
  return submitParams;
};

const initParams = {
  symbol: '',
  lastTradedPrice: 0,
  leverage: '2',
  gridProfitRatio: 0,
  maxLeverage: '10',
  direction: 'short',
  up: 0,
  down: 0,
  gridNum: 0,
  maxGridNum: 0,
  diff: 0,
  gridProfitUpperRatio: 0,
  gridProfitLowerRatio: 0,
  minInvestment: 0,
  maxInvestment: 0,
  borrowAmount: null,
  limitAsset: null,
  dailyRate: null,
  blowUpPrice: null,
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
    const allSubmitParams = validate({ formRef, allParamsRef, changedParams, mode });
    allSubmitParams && getCalcParamsRef.current(allSubmitParams);
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
