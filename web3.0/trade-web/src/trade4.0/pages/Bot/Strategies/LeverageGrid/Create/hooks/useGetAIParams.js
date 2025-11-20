/**
 * Owner: mike@kupotech.com
 */
import React, { useCallback } from 'react';
import useTicker from 'Bot/hooks/useTicker';
import { useSelector, useDispatch } from 'dva';
import { useModel } from '../model';
import Decimal from 'decimal.js';
import { numberFixed } from 'Bot/helper';

/**
 * @description: 轮训获取ai参数
 * @return {*}
 */
export default ({ symbol, direction, limitAsset, quotaPrecision, form }) => {
  const aiparams = useSelector((state) => state.leveragegrid.aiparams);
  const { setCommonSetting } = useModel();
  const dispatch = useDispatch();
  const fresh = useCallback(async () => {
    if (!symbol) {
      return;
    }
    let hasError = false;
    if (limitAsset) {
      try {
        await form.validateFields(['limitAsset'], { force: true });
      } catch (error) {
        hasError = true;
      }
    }
    if (hasError) return;
    dispatch({
      type: 'leveragegrid/getAIParams',
      payload: {
        symbol,
        direction,
        limitAsset,
      },
    }).then((aiInfo) => {
      if (aiInfo.direction && !direction) {
        setCommonSetting({ direction: aiInfo.direction });
      }
    });
  }, [symbol, direction, limitAsset]);
  useTicker(fresh, { isTrigger: Boolean(symbol), isTriggerByLogin: false });

  const cacheKey = `${symbol}-${direction}`;

  let results = aiparams[cacheKey];
  if (results) {
    results.minInvestment = Decimal(results?.minInvestment || 0).toFixed(
      quotaPrecision || 0,
      Decimal.ROUND_UP,
    );
    results.maxInvestment = Decimal(results?.maxInvestment || 0).toFixed(
      quotaPrecision || 0,
      Decimal.ROUND_UP,
    );
  } else {
    results = {
      symbol,
      lastTradedPrice: 0,
      leverage: '2',
      direction: 'long',
      up: 0,
      down: 0,
      gridNum: '',
      diff: '',
      gridProfitUpperRatio: '',
      gridProfitLowerRatio: '',
      minInvestment: 0,
      maxInvestment: 0,
      borrowAmount: null,
      dailyRate: null,
      blowUpPrice: null,
    };
  }
  return results;
};
