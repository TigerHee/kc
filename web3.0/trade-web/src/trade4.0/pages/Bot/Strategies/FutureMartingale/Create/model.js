/**
 * Owner: mike@kupotech.com
 */
import React, { createContext, useContext, useCallback, useEffect } from 'react';
import { nextTick, dropKeys, times100Process } from '../util';
import useWatchData, {
  getMinInvestBase,
  getMinInvest,
  getOverview,
  mergeLineData,
} from './useWatchData';
import useBalance from 'Bot/hooks/useBalance';
import useMergeState from 'Bot/hooks/useMergeState';
import useStateRef from '@/hooks/common/useStateRef';
import Decimal from 'decimal.js/decimal';
import { useSelector } from 'dva';
import { getInputMaxInvestPrecision } from 'FutureMartingale/config';
import { getParams } from 'FutureMartingale/services';
// import { useSelectGoldCoupon } from 'GoldCoupon/ExperienceGoldCoupon';
import { times100, isNull } from 'Bot/helper';
import _ from 'lodash';
import useGetCurrentSymbol from 'Bot/hooks/useGetCurrentSymbol';
import useFutureSymbolInfo from 'Bot/hooks/useFutureSymbolInfo';
import { Form } from 'Bot/components/Common/CForm';
import { useFuturePrice } from 'Bot/hooks/useLastTradedPrice';

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

/**
 * @description: 根据交易对获取ai参数
 * @param {*} symbolCode
 * @param {*} formData
 * @return {*}
 */
const getAIParams = async ({ symbolCode, formData, symbolInfo }) => {
  const { data } = await getParams(symbolCode ?? formData.symbol);
  times100Config.forEach((key) => {
    data[key] = !isNull(data[key]) ? times100(data[key]) : '';
  });
  // 三个字段必须精度处理
  ['minLimitAsset', 'maxLimitAsset', 'defaultLimitAsset'].forEach((key) => {
    data[key] = Decimal(data[key] ?? 0).toFixed(
      getInputMaxInvestPrecision(symbolInfo.precision),
      Decimal.ROUND_UP,
    );
  });
  data.limitAsset = data.defaultLimitAsset;
  return data;
};

export const Provider = ({ children, form }) => {
  const templateId = 12;
  const currentSymbol = useGetCurrentSymbol();
  const symbolInfo = useFutureSymbolInfo(currentSymbol);
  const lastTradedPrice = useFuturePrice(currentSymbol);
  const { base, quota, precision } = symbolInfo;
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
    direction: 'long',
    leverage: 2,
    price: lastTradedPrice,
    blowUpPrice: 0,

    openUnitPrice: '',
    circularOpeningCondition: 'IMMEDIATELY',
    minPrice: '',
    maxPrice: '',
    stopLossPercent: '',
    stopLossPrice: '',
    // ai参数
    coupon: '',
    stra: 'FUTURES_MARTIN_GALE',
    rawLineData: [],
  });
  // // 体验金
  // const goldCouponInfo = useSelectGoldCoupon(
  //   {
  //     form,
  //     key: 'limitAsset',
  //   },
  //   // 每次选择体验金卡券之前, 需要调用的函数; 强制只有使用ai参数
  //   async (selectedCoupon) => {
  //     const data = await getParamsHandlerRef.current(formData.symbol);
  //     setMergeState({
  //       ...data,
  //       leverage: data.defaultLeverage,
  //       buyAfterFall: data.defaultBuyAfterFall,
  //       buyTimes: data.defaultBuyTimes,
  //       buyMultiple: data.defaultBuyMultiple,
  //       stopProfitPercent: data.defaultStopProfitPercent,
  //       limitAsset: selectedCoupon?.trialAmount?.value, // 设置体验金的金额
  //       isAIParamsFill: true,
  //       isSubmitValid: false,
  //       openUnitPrice: '',
  //       circularOpeningCondition: 'IMMEDIATELY',
  //       minPrice: '',
  //       maxPrice: '',
  //       stopLossPercent: '',
  //       stopLossPrice: '',
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
    // lineData: mergeLineData(formData, symbolInfo),
    price: lastTradedPrice,
    // prizeId: goldCouponInfo?.selectedCoupon?.id,
    // goldCoupon: goldCouponInfo?.selectedCoupon,
    // hasPrizeId: !!goldCouponInfo?.selectedCoupon?.id,
  };
  const balance = useBalance(symbolInfo, 0, false);

  // 修改交易对
  const handleSymbolChange = useCallback(({ symbolCode }) => {
    // 交易对变化 先清空之前的数据
    clear({ symbol: symbolCode });
    nextTick(() => {
      // 交易对变化重新发起ai参数获取
      toggleParamsHandlerRef.current(symbolCode);
    });
  }, []);
  useEffect(() => {
    handleSymbolChange({ symbolCode: currentSymbol });
  }, [currentSymbol]);

  // 获取ai参数
  const getParamsHandlerRef = useStateRef((symbolCode) => {
    return getAIParams({ symbolCode, formData, symbolInfo });
  });

  const clear = (mergeState = {}) => {
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
      leverage: 2,
      ...mergeState,
    });
    form.resetFields();
  };
  // 处理获取清空ai参数
  const toggleParamsHandlerRef = useStateRef(async (symbolCode) => {
    if (formData.isAIParamsFill) {
      clear();
    } else {
      const data = await getParamsHandlerRef.current(
        typeof symbolCode === 'string' ? symbolCode : formData.symbol,
      );
      setMergeState({
        ...data,
        leverage: data.defaultLeverage,
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
  // 监听数据变化, 发起两个接口请求
  useWatchData(
    { allFormData, balance },
    (purifyData, next) => {
      // 获取最小投资额度
      getMinInvest({ allFormData: purifyData, setMergeState, form, precision }, next);
    },
    (mformData) => {
      //  获取当前委托价格
      // getOverview({ formData: mformData, balance }, (rawLineData) => {
      //   setMergeState({ rawLineData });
      // });
    },
    () => {
      setMergeState({ rawLineData: {} });
    },
  );
  // 方向变化需要清空参数
  const setDirection = useCallback((dir) => {
    setMergeState({ direction: dir });
  }, []);
  // 处理排行榜复制的参数填充；直接填充默认参数
  // useHandleDefaultParams({
  //   setMergeState,
  //   form,
  //   getParamsHandlerRef,
  //   toggleParamsHandlerRef,
  //   precision,
  // });

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
        setCoupon: useCallback((coupon) => {
          setMergeState({ coupon });
        }, []),
        setDirection,
        setLeverage: useCallback((leverage) => {
          setMergeState({ leverage });
        }, []),
        clear,
        form,
        toggleParamsHandler: toggleParamsHandlerRef.current,
      }}
    >
      {children}
    </ContextOfCreatePage.Provider>
  );
};

export const ContextOfParamsPage = ContextOfCreatePage;

export const useModel = () => useContext(ContextOfCreatePage);
