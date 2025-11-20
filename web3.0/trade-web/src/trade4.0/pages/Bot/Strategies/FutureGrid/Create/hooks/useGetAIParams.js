/**
 * Owner: mike@kupotech.com
 */
import React, { useCallback } from 'react';
import useTicker from 'Bot/hooks/useTicker';
import { useSelector, useDispatch } from 'dva';
import { useModel } from '../model';

/**
 * @description: 轮训获取ai参数
 * @return {*}
 */
export default ({ symbol, direction }) => {
  const aiparams = useSelector((state) => state.futuregrid.aiparams);
  const { setCommonSetting } = useModel();
  const dispatch = useDispatch();
  const fresh = useCallback(() => {
    if (!symbol) return;
    dispatch({
      type: 'futuregrid/getAIParams',
      payload: {
        symbol,
        direction,
      },
    }).then((aiInfo) => {
      if (aiInfo.direction && !direction) {
        setCommonSetting({ direction: aiInfo.direction });
      }
    });
  }, [symbol, direction]);
  useTicker(fresh, { isTrigger: Boolean(symbol), isTriggerByLogin: false });
  return aiparams[symbol]
    ? aiparams[symbol]
    : {
        diff: 0,
        direction: 'short',
        feeRatio: '0.0006',
        gridNum: 2,
        gridProfitLowerRatio: 0,
        gridProfitUpperRatio: 0,
        leverage: 2,
        lowerLimit: 0,
        minAmount: 0,
        multiplier: '0.001',
        upperLimit: 0,
        lowerPrice: 0,
        upperPrice: 0,
      };
};
