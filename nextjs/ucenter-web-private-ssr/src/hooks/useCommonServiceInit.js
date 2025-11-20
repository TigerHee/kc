/*
 * @owner: borden@kupotech.com
 */
import { getDvaApp } from '@/tools/dva/client';
import {
  precision2decimals,
  precision2step,
  step2precision,
  useCurrenciesFetch,
  useSymbolsFetch,
} from 'gbiz-next/common-service';
import { maxPrecision } from 'config/base';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { tenantConfig } from 'src/config/tenant';
import { kcsensorsManualExpose } from 'utils/ga';

// 将namespace定义成变量，绕开模型注册babel插件扫描
const MARKET = 'market';
const CATEGORIES = 'categories';

export default function useCommonServiceInit() {
  const dispatch = useDispatch();
  // 判断动态注册的模型是否挂载上了
  const isRegisterMarketModel = useSelector((state) => Boolean(state[MARKET]));
  const isRegisterCategoriesModel = useSelector((state) => Boolean(state[CATEGORIES]));

  const { run: currenciesFetch } = useCurrenciesFetch({
    manual: true,
    params: { domainIds: 'kucoin,kumex' },
    onSuccess: (resData) => {
      const getCategoriesFromStore = () => getDvaApp()._store.getState()[CATEGORIES];
      let categories;
      let coinsPayload;
      if (resData?.kucoin) {
        const list = [];
        categories = {};
        const categoriesFromStore = getCategoriesFromStore();
        Object.values(resData.kucoin).forEach((item) => {
          // @TODO 没用上，ab走完删除掉 utils/precision 文件
          // precision(item.coin, item.precision);
          item.key = item.currency;
          item.coin = item.currency;
          item.step = precision2step(item.precision);
          item.decimals = precision2decimals(item.precision);
          item.precision = parseInt(item.precision || maxPrecision, 10);

          // 本项目依赖了@kucoin-biz/transfer且传入了categories, 所以需要写入isContractEnabled
          if (resData?.kumex) {
            item.isContractEnabled = Boolean(resData.kumex[item.currency]);
          } else if (typeof categoriesFromStore?.[item.currency]?.isContractEnabled === 'boolean') {
            item.isContractEnabled = categoriesFromStore[item.currency].isContractEnabled;
          }

          list.push(item);
          categories[item.currency] = item;
        });

        coinsPayload = coinsPayload || {};
        coinsPayload.list = list;
      } else {
        categories = categories || getCategoriesFromStore();
        if (categories && resData?.kumex) {
          Object.keys(categories).forEach((currency) => {
            categories[currency] = Boolean(resData.kumex[currency]);
          });
        }
      }
      if (categories) {
        dispatch({
          type: `${CATEGORIES}/reset`,
          payload: categories,
        });
      }
      if (coinsPayload) {
        dispatch({
          type: 'coins/update',
          payload: coinsPayload,
          // poolCoinsMap, // 已搜索，未使用，不用初始化
          // poolCoins: data.pool, // 已搜索，未使用，不用初始化
          // kumexCoins: data.kumex, // 已搜索，未使用，不用初始化
          // kumexCoinsMap: data.kumex, // 已搜索，未使用，不用初始化
          // coinNamesMap: data.kumex, // 已搜索，未使用，不用初始化
        });
      }

      kcsensorsManualExpose(
        ['commonService_biz_result', '2'],
        {
          verify_result: 'success',
          bizType: 'ucenter-web',
        },
        'technology_event',
      );
    },
    onError: (error) => {
      kcsensorsManualExpose(
        ['commonService_biz_result', '2'],
        {
          verify_result: 'fail',
          fail_reason: error?.toString(),
          bizType: 'ucenter-web',
        },
        'technology_event',
      );
    },
  });

  const { run: symbolsFetch } = useSymbolsFetch({
    manual: true,
    onSuccess: (resData) => {
      const records = [];
      const allRecords = [];
      const symbolsInfoMap = {};
      // 扩充字段
      Object.values(resData).forEach((item) => {
        item.basePrecision = step2precision(item.baseIncrement);
        item.pricePrecision = step2precision(item.priceIncrement);
        item.quotePrecision = step2precision(item.quoteIncrement);

        allRecords.push(item);
        symbolsInfoMap[item.code] = item;
        if (item.enableTrading) records.push(item);
      });
      dispatch({
        type: `${MARKET}/update`,
        payload: { records, allRecords, symbolsInfoMap },
      });
      kcsensorsManualExpose(
        ['commonService_biz_result', '3'],
        {
          verify_result: 'success',
          bizType: 'ucenter-web',
        },
        'technology_event',
      );
    },
    onError: (error) => {
      kcsensorsManualExpose(
        ['commonService_biz_result', '3'],
        {
          verify_result: 'fail',
          fail_reason: error?.toString(),
          bizType: 'ucenter-web',
        },
        'technology_event',
      );
    },
  });

  useEffect(() => {
    if (isRegisterCategoriesModel && tenantConfig.common.showCurrency) {
      currenciesFetch();
    }
  }, [isRegisterCategoriesModel]);

  useEffect(() => {
    if (isRegisterMarketModel) {
      symbolsFetch();
    }
  }, [isRegisterMarketModel]);
}
