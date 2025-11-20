/*
 * owner: Clyne@kupotech.com
 */
import React, { Fragment } from 'react';
import { useSelector } from 'dva';
import { _t } from 'src/utils/lang';
import Tooltip from '@mui/Tooltip';
import { MarkPriceIcon, IndexPriceIcon, NetAssetIcon } from './Icon';
import { namespace } from '@/pages/Orderbook/config';
import { PriceWrapper, TooltipWrapper, SvgWrapper } from './style';
import { thousandPointed } from 'src/trade4.0/utils/format';
import { formatNumber } from '@/utils/format';
import { isSpotTypeSymbol } from 'src/trade4.0/hooks/common/useIsSpotSymbol';
import { useGetCurrentSymbol } from 'src/trade4.0/hooks/common/useSymbol';

const iconMap = {
  markPrice: MarkPriceIcon,
  indexPrice: IndexPriceIcon,
  netAssets: NetAssetIcon,
};

const Price = ({ dataKey, tips, className, fixed }) => {
  const price = useSelector((state) => state[namespace][dataKey]);
  const netAssets = useSelector((state) => state[namespace].netAssets);
  const currentSymbol = useGetCurrentSymbol();
  const isSpot = isSpotTypeSymbol(currentSymbol);
  if ((netAssets && dataKey === 'markPrice' && isSpot) || price === '' || price === undefined) {
    return null;
  }
  const Icon = iconMap[dataKey];
  return (
    <PriceWrapper className={`orderbook-${dataKey} ${className}`}>
      {tips ? (
        <Tooltip placement="top" title={<TooltipWrapper>{_t(tips)}</TooltipWrapper>}>
          <SvgWrapper>
            <Icon />
          </SvgWrapper>
        </Tooltip>
      ) : (
        <Icon />
      )}

      <div>{fixed ? formatNumber(price, { fixed, dropZ: false }) : thousandPointed(price)}</div>
    </PriceWrapper>
  );
};

export default Price;
