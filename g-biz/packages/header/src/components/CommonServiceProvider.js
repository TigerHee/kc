/*
 * @owner: borden@kupotech.com
 */
import { useDispatch } from 'react-redux';
import { useEventCallback } from '@kux/mui';
import { useContext, createContext } from 'react';
import { getSensorsABResult, kcsensorsManualTrack } from '@utils/sensors';
import { useCurrenciesFetch, useSymbolsFetch, step2precision } from '@packages/common-service';
import { namespace, maxPrecision, expireDuration } from '../Header/model';

const FetchContext = createContext({});
const abResultCache = {
  value: undefined, // 存储接口返回的结果
  promise: undefined, // 存储正在进行的请求的 Promise
};
const pullAbResult = async () => {
  // 如果已经有缓存的值，直接返回
  if (abResultCache.value) {
    return abResultCache.value;
  }
  // 如果正在发起请求，返回该请求的 Promise
  if (abResultCache.promise) {
    return abResultCache.promise;
  }
  // 如果没有缓存且没有正在进行的请求，发起请求
  abResultCache.promise = getSensorsABResult({
    param_name: 'gbiz_common_service_second',
    value_type: 'String',
    default_value: '0',
  }).then((result) => {
    abResultCache.value = result; // 缓存结果
    abResultCache.promise = null; // 清除 Promise 状态
    if (result === '1') {
      kcsensorsManualTrack(
        {
          spm: ['commonService_biz', '1'],
          data: {
            bizType: 'gbiz-header',
          },
        },
        'technology_event',
      );
    }
    return result;
  });

  return abResultCache.promise;
};

const CommonServiceProvider = ({ children }) => {
  const dispatch = useDispatch();

  const { run: currenciesFetch } = useCurrenciesFetch({
    manual: true,
    params: { domainIds: 'kucoin' },
    staleTime: expireDuration, // 跟原来的保持一致
    onSuccess: (resData) => {
      if (!resData?.kucoin) return;
      const categories = {};

      Object.values(resData.kucoin).forEach((item) => {
        // precision(item.coin, item.precision); // @TODO 没用上
        item.key = item.currency;
        item.precision = parseInt(item.precision || maxPrecision, 10);
        categories[item.currency] = item;
      });

      dispatch({
        type: `${namespace}/update`,
        payload: { coinsCategorys: categories },
      });

      kcsensorsManualTrack(
        {
          spm: ['commonService_biz_result', '2'],
          data: {
            verify_result: 'success',
            bizType: 'gbiz-header',
          },
        },
        'technology_event',
      );
    },
    onError: (error) => {
      kcsensorsManualTrack(
        {
          spm: ['commonService_biz_result', '2'],
          data: {
            verify_result: 'fail',
            fail_reason: error?.toString(),
            bizType: 'gbiz-header',
          },
        },
        'technology_event',
      );
    },
  });

  const { run: symbolsFetch } = useSymbolsFetch({
    manual: true,
    staleTime: expireDuration, // 跟原来的保持一致
    onSuccess: (resData) => {
      const symbols = [];
      const symbolsMap = {};
      // 扩充字段
      Object.values(resData).forEach((item) => {
        item.symbol = item.symbolCode; // 交易对code
        item.symbolName = item.symbol; // 交易对名称（与杠杆的数据一致）
        item.basePrecision = step2precision(item.baseIncrement);
        item.pricePrecision = step2precision(item.priceIncrement);
        item.quotePrecision = step2precision(item.quoteIncrement);
        symbolsMap[item.code] = item;
        symbols.push(item);
      });
      dispatch({
        type: `${namespace}/update`,
        payload: { symbols, symbolsMap },
      });
      kcsensorsManualTrack(
        {
          spm: ['commonService_biz_result', '3'],
          data: {
            verify_result: 'success',
            bizType: 'gbiz-header',
          },
        },
        'technology_event',
      );
    },
    onError: (error) => {
      kcsensorsManualTrack(
        {
          spm: ['commonService_biz_result', '3'],
          data: {
            verify_result: 'fail',
            fail_reason: error?.toString(),
            bizType: 'gbiz-header',
          },
        },
        'technology_event',
      );
    },
  });

  // 拉取币种配置
  const pullCurrencies = useEventCallback(async () => {
    await pullAbResult();
    if (abResultCache.value === '1') {
      currenciesFetch();
    } else {
      dispatch({ type: `${namespace}/getCoinsCategory` });
    }
  });
  // 拉取币对配置
  const pullSymbols = useEventCallback(async () => {
    await pullAbResult();
    if (abResultCache.value === '1') {
      symbolsFetch();
    } else {
      dispatch({ type: `${namespace}/pullSymbols` });
    }
  });

  return (
    <FetchContext.Provider value={{ pullCurrencies, pullSymbols }}>
      {children}
    </FetchContext.Provider>
  );
};

export function useCommonService() {
  return useContext(FetchContext);
}

export default CommonServiceProvider;
