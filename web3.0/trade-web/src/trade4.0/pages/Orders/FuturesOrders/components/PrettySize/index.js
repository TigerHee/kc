/**
 * Owner: clyne@kupotech.com
 */
import React from 'react';
import { get } from 'lodash';
import { _t } from 'utils/lang';
import { formatCurrency } from '@/utils/futures';
import { formatNumberKMB } from '@/utils/format';
import { FUTURES } from '@/meta/const';
import { useGetSymbolInfo } from '@/hooks/common/useSymbol';
import { useUnit } from '@/hooks/futures/useUnit';
import { QUANTITY_UNIT } from '@/pages/Orders/FuturesOrders/config';
import { multiply } from 'utils/operation';
import { styled, fx } from '@/style/emotion';
import { getDigit } from 'helper';

const PrettySizeWrapper = styled.span`
  ${fx.fontSize('12')}
  ${fx.lineHeight('16')}
  ${fx.fontWeight('400')}
  ${fx.wordBreak('break-word')}
`;

const PrettySizeValue = styled.span``;

const PrettySizeUnit = styled.span``;

// 此组件仅用作数量显示
const PrettySize = ({
  symbol,
  value,
  unit = true,
  fix = false,
  formatProps = {},
  className = '',
}) => {
  const contract = useGetSymbolInfo({ symbol, tradeType: FUTURES });
  const tradingUnit = useUnit();
  if (!contract) {
    return '-';
  }
  const formatValue = formatNumberKMB(value, { showMinStep: false, formatProps });

  // 反向合约只有张的显示
  if (contract.isInverse) {
    return unit ? (
      <PrettySizeWrapper className={`${className} pretty-size`}>
        <PrettySizeValue>{formatValue}</PrettySizeValue>
        <PrettySizeUnit>{` ${_t('global.unit')}`}</PrettySizeUnit>
      </PrettySizeWrapper>
    ) : (
      formatValue
    );
  }

  if (!contract.isInverse && tradingUnit === QUANTITY_UNIT) {
    return unit ? (
      <PrettySizeWrapper className={`${className} pretty-size`}>
        <PrettySizeValue className="noRtl">{formatValue}</PrettySizeValue>
        <PrettySizeUnit>{` ${_t('global.unit')}`}</PrettySizeUnit>
      </PrettySizeWrapper>
    ) : (
      formatValue
    );
  }
  const multiplierSize = get(contract, 'multiplier', 0);
  const size = multiply(value)(multiplierSize);

  if (!fix) {
    const formatSize = formatNumberKMB(size, { showMinStep: false, formatProps });
    return (
      <PrettySizeWrapper className={`${className} pretty-size`}>
        {unit ? `${formatSize} ${formatCurrency(contract.baseCurrency)}` : formatSize}
      </PrettySizeWrapper>
    );
  }
  const formatUnitSize = formatNumberKMB(size, {
    showMinStep: false,
    fixed: getDigit(multiplierSize, true),
    formatProps,
  });
  return (
    <PrettySizeWrapper className={`${className} pretty-size`}>
      {unit ? `${formatUnitSize} ${formatCurrency(contract.baseCurrency)}` : formatUnitSize}
    </PrettySizeWrapper>
  );
};

export default React.memo(PrettySize);
