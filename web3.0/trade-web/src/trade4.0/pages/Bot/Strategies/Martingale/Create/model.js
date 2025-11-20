/**
 * Owner: mike@kupotech.com
 */
import React, { createContext, useContext, useCallback, useEffect } from 'react';
import useBalance from 'Bot/hooks/useBalance';
import useMergeState from 'Bot/hooks/useMergeState';
import useStateRef from '@/hooks/common/useStateRef';
import useSpotSymbolInfo from 'Bot/hooks/useSpotSymbolInfo';
import Decimal from 'decimal.js/decimal';
import { useSelector } from 'dva';
// import { useSelectGoldCoupon } from 'GoldCoupon/ExperienceGoldCoupon';
import { isNull, times100 } from 'Bot/helper';
import _ from 'lodash';
import debounce from 'lodash/debounce';
import { getParams, postMinInvest } from '../services';
import useGetCurrentSymbol from 'Bot/hooks/useGetCurrentSymbol';
import useLastTradedPrice from 'Bot/hooks/useLastTradedPrice';
import { Form } from 'Bot/components/Common/CForm';
import useOpenOverview from './useOpenOverview';

const ContextOfCreatePage = createContext(null);
// 需要乘以100的keys
const times100Config = [
  'buyAfterFall',
  'stopProfitPercent',
  'stopLossPercent',
  'defaultBuyAfterFall',
  'minBuyAfterFall',
  'maxBuyAfterFall',
  'defaultStopProfitPercent',
  'minStopProfitPercent',
  'maxStopProfitPercent',
];
// 需要填充到model的keys
const fillKeys = [
  'symbol',
  'buyAfterFall',
  'buyTimes',
  'buyMultiple',
  'stopProfitPercent',
  'openUnitPrice',
  'minPrice',
  'maxPrice',
  'stopLossPercent',
  'stopLossPrice',
];
// 上限范围限制keys
const rangeKeys = [
  'minBuyAfterFall',
  'maxBuyAfterFall',
  'minBuyTimes',
  'maxBuyTimes',
  'minBuyMultiple',
  'maxBuyMultiple',
  'minLimitAsset',
  'maxLimitAsset',
  'minStopProfitPercent',
  'maxStopProfitPercent',
];

const nextTick = (callback) => {
  Promise.resolve().then(callback);
};
/**
 * @description: 获取最小投资额 限制
 * @param {*} buyTimes
 * @param {*} buyMultiple
 * @param {*} symbol
 * @return {*}
 */
const getMinInvestBase = async ({ buyTimes, buyMultiple, symbol }) => {
  try {
    if (Number(buyTimes) > 0 && Number(buyMultiple) > 0 && symbol) {
      const result = await postMinInvest({
        symbol,
        buyTimes,
        buyMultiple,
      });
      if (result.data) {
        return result.data;
      }
    }
  } catch (error) {
    return null;
  }
};

/**
 * @description: 防抖获取最小投资额度限制
 * @param {*} formData 数据ref
 * @param {*} setMergeState 更新函数
 * @param {*} form 表单
 * @return {*}
 */
export const getMinInvest = debounce(async (formData, next) => {
  try {
    // 始终拿到最新值
    const { symbol, buyTimes, buyMultiple } = formData;
    const minLimitAsset = await getMinInvestBase({ symbol, buyTimes, buyMultiple });
    next(minLimitAsset);
  } catch (error) {
    console.log(error);
  }
}, 1000);

/**
 * @description: 处理排行榜复制的参数填充；直接填充默认参数
 * @param {*} setMergeState
 * @param {*} form
 * @param {*} getParamsHandlerRef
 * @param {*} toggleParamsHandlerRef
 * @return {*}
 */
// const useHandleDefaultParams = ({
//   setMergeState,
//   form,
//   getParamsHandlerRef,
//   toggleParamsHandlerRef,
// }) => {
//   // 获取要复制的参数
//   const copyParams = useGetCopyParams();
//   useEffect(() => {
//     if (!_.isEmpty(copyParams)) {
//       // 有复制参数，先通过接口获取限制的范围，最后整合到一起
//       const handler = async () => {
//         // 先获取默认参数中的上下范围限制
//         const rangeData = await getParamsHandlerRef.current(copyParams.symbol);
//         // 根据下面参数获取最小投资额度
//         const minLimitAssetNow = await getMinInvestBase({
//           symbol: copyParams.symbol,
//           buyTimes: copyParams.buyTimes,
//           buyMultiple: copyParams.buyMultiple,
//         });
//         if (minLimitAssetNow) {
//           rangeData.minLimitAsset = minLimitAssetNow;
//         }
//         // 填充到model
//         const state = getCopyState(copyParams, rangeData);
//         setMergeState(state);
//         // 填充到form
//         form.setFieldsValue({
//           buyAfterFall: state.buyAfterFall,
//           buyTimes: state.buyTimes,
//           buyMultiple: state.buyMultiple,
//           stopProfitPercent: state.stopProfitPercent,
//         });
//       };
//       handler();
//     } else {
//       // 没有复制参数， 就直接通过接口填充参数
//       toggleParamsHandlerRef.current();
//     }
//   }, []);
// };

export const Provider = ({ children, form }) => {
  const templateId = 7;
  const currentSymbol = useGetCurrentSymbol();
  const symbolInfo = useSpotSymbolInfo(currentSymbol);
  const lastTradedPrice = useLastTradedPrice(currentSymbol);
  const { base, quota } = symbolInfo;
  const [formData, setMergeState] = useMergeState({
    popVisibile: false,
    isAIParamsFill: false,
    isSubmitValid: false,
    errMsg: {},
    // 提交字段
    symbol: currentSymbol,
    buyAfterFall: '',
    buyTimes: '',
    buyMultiple: '',
    stopProfitPercent: '',
    limitAsset: '',

    openUnitPrice: '',
    circularOpeningCondition: 'IMMEDIATELY',
    minPrice: '',
    maxPrice: '',
    stopLossPercent: '',
    stopLossPrice: '',
    price: lastTradedPrice,
    // ai参数
    coupon: '',
    stra: 'MARTIN_GALE',
    direction: 'long', // 模拟合约马丁的字段
  });

  // 体验金
  // const goldCouponInfo = useSelectGoldCoupon(
  //   {
  //     form,
  //     key: 'limitAsset',
  //   },
  //   // 每次选择体验金卡券之前, 需要调用的函数; 强制只有使用ai参数
  //   async (selectedCoupon) => {
  //     const data = await getParamsHandlerRef.current();
  //     setMergeState({
  //       ...data,
  //       buyAfterFall: data.defaultBuyAfterFall,
  //       buyTimes: data.defaultBuyTimes,
  //       buyMultiple: data.defaultBuyMultiple,
  //       stopProfitPercent: data.defaultStopProfitPercent,
  //       limitAsset: selectedCoupon?.trialAmount?.value,
  //       isAIParamsFill: true,
  //       isSubmitValid: false,
  //       openUnitPrice: '',
  //       circularOpeningCondition: 'IMMEDIATELY',
  //       minPrice: '',
  //       maxPrice: '',
  //       stopLossPercent: '',
  //       stopLossPrice: '',
  //       // ai参数
  //       coupon: '',
  //     });
  //     form.setFieldsValue({
  //       buyAfterFall: data.defaultBuyAfterFall,
  //       buyTimes: data.defaultBuyTimes,
  //       buyMultiple: data.defaultBuyMultiple,
  //       stopProfitPercent: data.defaultStopProfitPercent,
  //       limitAsset: selectedCoupon?.trialAmount?.value,
  //     });
  //   },
  // );

  const values = Form.useWatch([], form) ?? {};
  // 将form表单数据和state数据合并
  const allFormData = {
    ...formData,
    ...values,
    price: lastTradedPrice,
    // prizeId: goldCouponInfo?.selectedCoupon?.id,
    // goldCoupon: goldCouponInfo?.selectedCoupon,
    // hasPrizeId: !!goldCouponInfo?.selectedCoupon?.id,
  };
  const balance = useBalance(symbolInfo, 0, false);
  // 修改交易对
  const handleSymbolChange = useCallback(({ symbolCode }) => {
    // 交易对变化 先清空之前的数据
    clear();
    nextTick(() => {
      setMergeState({ symbol: symbolCode });
      toggleParamsHandlerRef.current(symbolCode);
    });
  }, []);
  useEffect(() => {
    handleSymbolChange({ symbolCode: currentSymbol });
  }, [currentSymbol]);

  // 获取ai参数
  const getParamsHandlerRef = useStateRef((symbolCode) => {
    return getParams(symbolCode ?? currentSymbol).then(({ data }) => {
      times100Config.forEach((key) => {
        if (!isNull(data[key])) {
          data[key] = times100(data[key]);
        }
      });
      // defaultLimitAsset ai参数中的最小投资额
      const limitAsset = Decimal(data.defaultLimitAsset).toFixed(
        symbolInfo.quotaPrecision,
        Decimal.ROUND_UP,
      );
      data.limitAsset = limitAsset;
      return data;
    });
  });

  const clear = () => {
    setMergeState({
      isAIParamsFill: false,
      buyAfterFall: '',
      buyTimes: '',
      buyMultiple: '',
      stopProfitPercent: '',
      limitAsset: '',
      openUnitPrice: '',
      circularOpeningCondition: 'IMMEDIATELY',
      minPrice: '',
      maxPrice: '',
      stopLossPercent: '',
      stopLossPrice: '',
    });
    form.resetFields();
  };
  // 处理获取清空ai参数
  const toggleParamsHandlerRef = useStateRef(async (symbolCode) => {
    if (formData.isAIParamsFill) {
      clear();
    } else {
      const data = await getParamsHandlerRef.current(
        typeof symbolCode === 'string' ? symbolCode : null,
      );
      setMergeState({
        ...data,
        buyAfterFall: data.defaultBuyAfterFall,
        buyTimes: data.defaultBuyTimes,
        buyMultiple: data.defaultBuyMultiple,
        stopProfitPercent: data.defaultStopProfitPercent,
        // limitAsset: data.limitAsset,
        isAIParamsFill: true,
        isSubmitValid: false,
      });
      form.setFieldsValue({
        buyAfterFall: data.defaultBuyAfterFall,
        buyTimes: data.defaultBuyTimes,
        buyMultiple: data.defaultBuyMultiple,
        stopProfitPercent: data.defaultStopProfitPercent,
        // limitAsset: data.limitAsset,
      });
    }
  });

  // ref最新引用
  const dataRef = useStateRef({
    templateId,
    symbolInfo,
    symbolCode: currentSymbol,
    base,
    quota,
    balance,
    formData: allFormData,
    form,
  });
  useOpenOverview({ formData: allFormData, balance, symbolInfo, form, setMergeState });
  // 处理排行榜复制的参数填充；直接填充默认参数
  // useHandleDefaultParams({ setMergeState, form, getParamsHandlerRef, toggleParamsHandlerRef });
  return (
    <ContextOfCreatePage.Provider
      value={{
        dataRef,
        templateId,
        symbolInfo,
        symbolCode: currentSymbol,
        base,
        quota,
        balance,
        formData: allFormData,
        setMergeState,
        clear,
        setCoupon: useCallback((coupon) => {
          setMergeState({ coupon });
        }, []),
        form,
        toggleParamsHandler: toggleParamsHandlerRef.current,
      }}
    >
      {children}
    </ContextOfCreatePage.Provider>
  );
};

export const ContextOfParamsPage = ContextOfCreatePage;
export const useModel = () => {
  return useContext(ContextOfCreatePage);
};
