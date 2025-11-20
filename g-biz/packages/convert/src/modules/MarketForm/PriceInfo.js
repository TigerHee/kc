/*
 * owner: borden@kupotech.com
 */
import React from 'react';
import { Box, useResponsive } from '@kux/mui';
import { useTranslation } from '@tools/i18n';
import { ICQuestionOutlined } from '@kux/icons';
import Tooltip from '../../components/common/Tooltip';
import usePriceSymbol from '../../hooks/form/usePriceSymbol';
import NumberFormat from '../../components/common/NumberFormat';
import CoinCodeToName from '../../components/common/CoinCodeToName';
import { FlexBox, MarketPrice, TooltipContent, StyledSwapIcon } from './style';

const PriceInfo = ({ data }) => {
  const { sm } = useResponsive();
  const { t: _t } = useTranslation('convert');
  const { onChange, priceSymbol, priceBaseCurrency, priceQuoteCurrency } = usePriceSymbol();

  return (
    <MarketPrice>
      <FlexBox>
        {_t('qidVjpf13KYd5L8hNg1dHT')}{' '}
        <Tooltip title={_t('hJcaFw4JoE8xd4f4BzVcJ7')}>
          <TooltipContent>
            <ICQuestionOutlined size={sm ? 14 : 12} />
          </TooltipContent>
        </Tooltip>
      </FlexBox>
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
