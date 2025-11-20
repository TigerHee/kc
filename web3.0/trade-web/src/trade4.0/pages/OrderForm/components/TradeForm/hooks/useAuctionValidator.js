/**
 * Owner: odan.ou@kupotech.com
 */

// 集合竞价校验逻辑
import { useCallback, useMemo } from 'react';
import { useSelector, shallowEqual } from 'dva';
import { _t } from 'utils/lang';
import { dropZeroSafe } from '@/utils/digit';
import { getModelAuctionInfo } from '@/utils/business';

/**
 * 处理集合竞价校验
 * @param {{
 *  needValidator?: boolean,
 *  priceCeiling?: string | number,
 *  priceFloor?; string | number,
 * }} conf
 */
const useAuctionValidatorHandle = (conf) => {
  const { needValidator, priceCeiling, priceFloor } = conf || {};
  const validator = useCallback((_, val) => {
    const value = +val;
    if (value && needValidator) {
      if (value > priceCeiling || value < priceFloor) {
        return Promise.reject(_t('trd.ca.price.check',
          { lowest: dropZeroSafe(priceFloor), highest: dropZeroSafe(priceCeiling) },
        ));
      }
    }
    return Promise.resolve();
  }, [priceFloor, priceCeiling, needValidator]);

  return useMemo(() => {
    return [{
      validator,
    }];
  }, [validator]);
};

const useAuctionValidator = () => {

  const state = useSelector(modelState => {
    const { trade, callAuction } = modelState;
    const coinPair = trade.currentSymbol;
    const auctionInfo = callAuction.auctionMap?.[coinPair];
    const { showAuction } = getModelAuctionInfo(modelState, coinPair); // 展示集合竞价

    const {
      priceCeiling, // 价格上限
      priceFloor, // 价格下限
    } = auctionInfo?.auctionConf || {};
    const needValidator = !!priceCeiling && !!priceFloor && showAuction;
    return {
      needValidator,
      priceCeiling,
      priceFloor,
    };
  }, shallowEqual);

  const res = useAuctionValidatorHandle(state);
  return res;
};

export default useAuctionValidator;
