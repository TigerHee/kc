/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-06-21 21:57:04
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-06-29 11:02:51
 * @FilePath: /trade-web/src/trade4.0/components/SymbolFlag/index.js
 * @Description:交易对标识，如 10X
 */
import React, { useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'dva';
import { _t } from 'utils/lang';
import useEtfCoin from 'utils/hooks/useEtfCoin';
import { BUY_TYPE, getMarginFundFlag } from './config';
import { styled, fx } from '@/style/emotion';
import { MARGIN_TABS_MAP } from '@/meta/margin';

export const FlagTag = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  border-radius: 2px;
  padding: 0 2px;
  line-height: 14px;
  white-space: nowrap;
  padding: 2px;
  font-weight: 500;
  margin: 0 4px;
  background: ${(props) => props.theme.colors.primary12};
  ${(props) => fx.color(props, 'primary')};
  &.long {
    background: ${(props) => props.theme.colors.primary12};
    ${(props) => fx.color(props, 'primary')};
  }
  &.short {
    background: ${(props) => props.theme.colors.secondary12};
    ${(props) => fx.color(props, 'secondary')};
  }
`;
// 请求锁
let fetchLock = false;
export default React.memo(
  ({ symbol, className, type = MARGIN_TABS_MAP.ALL.value, ...restProps }) => {
    const dispatch = useDispatch();
    const etfCoin = useEtfCoin(symbol);
    const configs = useSelector((state) => state.marginMeta.configs);
    const tokensMap = useSelector((state) => state.leveragedTokens.tokensMap);
    const marginSymbolsMap = useSelector((state) => state.symbols.marginSymbolsMap);
    const { multiple, buyType } = tokensMap[etfCoin] || {};
    const { isMarginEnabled, isolatedMaxLeverage } =
      marginSymbolsMap[symbol] || {};
    const marginMaxLeverage = isMarginEnabled ? (configs || {}).maxLeverage : 0;

    const { getMaxLeverage = () => 0 } = MARGIN_TABS_MAP[type] || {};
    const maxLeverage = useMemo(() => {
      return getMaxLeverage({ marginMaxLeverage, isolatedMaxLeverage });
    }, [type, marginMaxLeverage, isolatedMaxLeverage]);

    useEffect(() => {
      if (etfCoin && !fetchLock) {
        fetchLock = true;
        dispatch({
          type: 'leveragedTokens/queryBaseTokens',
        }).then(success => {
          if (!success) {
            fetchLock = false;
          }
        }).catch(() => {
          fetchLock = false;
        });
      }
    }, [Boolean(etfCoin)]);

    const flag = useMemo(() => {
      if (buyType) {
        return getMarginFundFlag(multiple, buyType);
      }
      return maxLeverage ? `${maxLeverage}x` : '';
    }, [multiple, buyType, maxLeverage]);

    return flag ? (
      <FlagTag
        buyType={buyType}
        className={buyType === BUY_TYPE.S ? 'short' : 'long'}
        {...restProps}
      >
        {flag}
      </FlagTag>
    ) : null;
  },
);
