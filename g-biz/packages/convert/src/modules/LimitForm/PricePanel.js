/*
 * owner: borden@kupotech.com
 */
import React from 'react';
// import { useSelector } from 'react-redux';
import { useTranslation } from '@tools/i18n';
import { isFinite } from '../../utils/format';
import InputNumber from '../../components/InputNumber';
import NumberFormat from '../../components/common/NumberFormat';
import CoinCodeToName from '../../components/common/CoinCodeToName';
import usePriceSymbol from '../../hooks/form/usePriceSymbol';
// import { NAMESPACE } from '../../config';
import {
  Unit,
  Header,
  Container,
  // DangerAlert,
  MarketPrice,
  PricePrefix,
  StyledSwapIcon,
} from './style';

const PricePanel = ({
  value,
  marketPrice,
  estimateFieldName,
  onReverse,
  onChange,
  // isAutoFillPrice,
}) => {
  const {
    priceSymbol,
    priceBaseCurrency,
    priceQuoteCurrency,
    onChange: onChangePriceSymbol,
  } = usePriceSymbol({ onChange: onReverse });
  const { t: _t } = useTranslation('convert');
  // const toCurrency = useSelector((state) => state[NAMESPACE].toCurrency);
  // const fromCurrency = useSelector((state) => state[NAMESPACE].fromCurrency);

  const lastPrice = marketPrice?.[priceSymbol];
  // const isBuy = `${toCurrency}-${fromCurrency}` === priceSymbol;

  return (
    <>
      <Container style={{ marginTop: 18 }}>
        <Header>
          {estimateFieldName === 'price'
            ? _t('5XPoKV1QmsuC5YBb38Pj7d')
            : _t('jcnDzL7F7x7NjMTUHEtK1i')}
          {isFinite(lastPrice) && (
            <MarketPrice onClick={() => onChange(lastPrice, undefined, false)}>
              {_t('eGwpF124ZhDJCqEkFioFQQ')}
              <NumberFormat>{lastPrice}</NumberFormat>
            </MarketPrice>
          )}
        </Header>
        <PricePrefix>
          1{' '}
          <span>
            <CoinCodeToName coin={priceBaseCurrency} />
          </span>{' '}
          =
        </PricePrefix>
        <InputNumber
          size="small"
          value={value}
          onChange={onChange}
          unit={
            <Unit>
              <CoinCodeToName coin={priceQuoteCurrency} />
              <StyledSwapIcon size={16} onClick={onChangePriceSymbol} />
            </Unit>
          }
        />
      </Container>
      {/* {!isAutoFillPrice && comparedTo(...(isBuy ? [lastPrice, value] : [value, lastPrice])) < 0 && (
        <DangerAlert>
          {isBuy ? _t('aTSugS3m11DTyKAseD3jdq') : _t('uoTqfmLbhMfgM6w6dYdDfA')}
        </DangerAlert>
      )} */}
    </>
  );
};

export default React.memo(PricePanel);
