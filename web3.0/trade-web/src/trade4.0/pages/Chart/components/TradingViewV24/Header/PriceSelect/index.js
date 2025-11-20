/**
 * Owner: garuda@kupotech.com
 */
import React, { useCallback } from 'react';

import { styled } from '@/style/emotion';

import { isSpotTypeSymbol } from '@/hooks/common/useIsSpotSymbol';

import DSelect from '@/components/DropdownSelect';
import dropStyle from '@/components/DropdownSelect/style';

import { _t } from 'utils/lang';
import { FUTURES } from '@/meta/const';
import { KLINE_PRICE_OPTIONS } from './config';
import { getOriginSymbolForKlineSymbol, useKlinePriceType, useKlinePriceTypeFunc } from './hooks';

const Select = styled(DSelect)` 
  .KuxDropDown-trigger {
    margin-right: ${(props) => (props.type === 'normal' ? 'unset' : '12px')};
  }
  .dropdown-value {
    padding: 0 2px;
    font-size: 12px;
    font-weight: 500;
    line-height: 1.3;
    color: ${(props) => props.theme.colors.text60};
  }
`;

export const DropdownExtend = {
  List: styled(dropStyle.List)`
    .dropdown-item {
      font-size: 14px;
      display: flex;
      align-items: center;
    }
  `,
};


const PriceSelect = ({ symbol, tradeType, type = 'normal' }) => {
  const originSymbol = symbol || getOriginSymbolForKlineSymbol(symbol);
  const priceType = useKlinePriceType(originSymbol);
  const onKlinePriceTypeChange = useKlinePriceTypeFunc();

  const handleSelectChange = useCallback(
    (v) => {
      onKlinePriceTypeChange(v, originSymbol);
    },
    [onKlinePriceTypeChange, originSymbol],
  );

  if (isSpotTypeSymbol(symbol) || tradeType !== FUTURES) return null;

  return (
    <Select
      size="small"
      value={priceType}
      configs={KLINE_PRICE_OPTIONS}
      onChange={handleSelectChange}
      disablePortal={false}
      type={type}
      extendStyle={DropdownExtend}
    />
  );
};

export default React.memo(PriceSelect);
