/**
 * Owner: borden@kupotech.com
 */
/*
 * @Author: Borden.Lan
 * @Date: 2021-03-11 16:47:36
 * @Description: 交易对标识，如 10X
 */
import React, { useMemo } from 'react';
import { useSelector } from 'dva';
import clxs from 'classnames';
import { _t } from 'utils/lang';
import useEtfCoin from 'utils/hooks/useEtfCoin';
import { BUY_TYPE, MARGIN_TABS_MAP, getMarginFundFlag } from './config';
import styles from './styles/style.less';

export default React.memo(({
  symbol,
  className,
  type = MARGIN_TABS_MAP.ALL.value,
  ...restProps
}) => {
  const etfCoin = useEtfCoin(symbol);
  const { configs } = useSelector(state => state.marginMeta);
  const { tokensMap } = useSelector(state => state.leveragedTokens);
  const { marginSymbolsMap } = useSelector(state => state.symbols);

  const { multiple, buyType } = tokensMap[etfCoin] || {};
  const { isMarginEnabled, isolatedMaxLeverage } = marginSymbolsMap[symbol] || {};
  const marginMaxLeverage = isMarginEnabled ? (configs || {}).maxLeverage : 0;

  const { getMaxLeverage = () => 0 } = MARGIN_TABS_MAP[type] || {};
  const maxLeverage = useMemo(() => {
    return getMaxLeverage({ marginMaxLeverage, isolatedMaxLeverage });
  }, [type, marginMaxLeverage, isolatedMaxLeverage]);

  const flag = useMemo(() => {
    if (buyType) {
      return getMarginFundFlag(multiple, buyType);
    }
    return maxLeverage ? `${maxLeverage}X` : '';
  }, [multiple, buyType, maxLeverage]);

  return flag ? (
    <span
      className={clxs(styles.tag, {
        [className]: !!className,
        [styles.long]: buyType === BUY_TYPE.L,
        [styles.short]: buyType === BUY_TYPE.S,
      })}
      {...restProps}
    >
      {flag}
    </span>
  ) : null;
});
