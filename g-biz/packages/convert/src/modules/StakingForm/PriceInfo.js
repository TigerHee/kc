/*
 * owner: june.lee@kupotech.com
 */
import React from 'react';
import { Box } from '@kux/mui';
import { useTranslation } from '@tools/i18n';
import useStakingPriceSymbol from './hooks/useStakingPriceSymbol';
import NumberFormat from '../../components/common/NumberFormat';
import CoinCodeToName from '../../components/common/CoinCodeToName';
import { FlexBox, MarketPrice, StyledSwapIcon } from './style';

const PriceInfo = ({ data }) => {
  const { t: _t } = useTranslation('convert');
  const { onChange, priceSymbol, priceBaseCurrency, priceQuoteCurrency } = useStakingPriceSymbol();

  return (
    <MarketPrice>
      <FlexBox>{_t('qidVjpf13KYd5L8hNg1dHT')}</FlexBox>
      <FlexBox>
        1 <CoinCodeToName coin={priceBaseCurrency} />
        <Box margin="0 4px">≈</Box>
        <NumberFormat>{data[priceSymbol]}</NumberFormat>{' '}
        <CoinCodeToName coin={priceQuoteCurrency} />
        <StyledSwapIcon size={14} onClick={onChange} />
      </FlexBox>
    </MarketPrice>
  );
};

export default React.memo(PriceInfo);
