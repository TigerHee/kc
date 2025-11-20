/**
 * Owner: charles.yang@kupotech.com
 */
import React, { memo, Fragment, useMemo } from 'react';
import Text from '@/components/Text';
import { multiply } from 'helper';
import { _t } from 'utils/lang';
import { FUTURES } from '@/meta/const';
import { thousandPointed } from '@/utils/format';
import { formatCurrency } from '@/utils/futures/formatCurrency';
import { useSymbolUnit, useTransformAmount, useUnit } from '@/hooks/futures/useUnit';
import { useGetSymbolInfo } from '@/hooks/common/useSymbol';
import { useGetPositionCalcData } from '@/hooks/futures/useCalcData';
import PrettySize from '@/pages/Orders/FuturesOrders/components/PrettySize';
import { QUANTITY_UNIT } from '@/pages/Orders/FuturesOrders/config';
import { styled, fx } from '@/style/emotion';
import PrettyCurrency from '@/components/PrettyCurrency';

const QtyCellWrapper = styled.div``;

const TipsContent = styled.div`
  ${fx.minWidth('180', 'px')}
`;

const TipsItem = styled.div`
  ${fx.display('flex')}
  ${fx.fontSize('12')}
  ${fx.lineHeight('16')}
  ${fx.fontWeight('400')}
`;

const TipsLabel = styled.div`
  ${fx.textAlign('left')}
  ${fx.flex('1')}
  color: rgba(243, 243, 243, 0.4);
`;

const TipsValue = styled.div`
  ${fx.textAlign('right')}// ${(props) => fx.color(props, 'text')}
`;

const QtyCell = ({ isFold = false, row = {} }) => {
  const { currentQty, symbol, markValue, isTrialFunds } = row;
  const { unit: showUnit } = useSymbolUnit({ symbol });
  const contract = useGetSymbolInfo({ symbol, tradeType: FUTURES });
  const { quantityToBaseCurrency } = useTransformAmount({ tradeType: FUTURES, symbol });

  // 用来显示
  const amount = quantityToBaseCurrency(currentQty);

  const { multiplier, isInverse, baseCurrency, settleCurrency } = contract;
  const baseCurrencyAmount = multiply(currentQty, multiplier || 0).toNumber();
  const amountVal = isInverse
    ? `${amount} ${_t('global.unit')}`
    : `${thousandPointed(baseCurrencyAmount)} ${formatCurrency(baseCurrency)}`;

  const calcData = useGetPositionCalcData(symbol);
  // 体验金的仓位不需要计算，有推送
  const positionMarkValue = isTrialFunds ? markValue : calcData?.markValue || markValue;

  const foldTips = useMemo(
    () => (
      <TipsContent>
        <TipsItem>
          <TipsLabel>{_t('futures.position.has.unit')}</TipsLabel>
          <TipsValue>
            {currentQty} {_t('global.unit')}
          </TipsValue>
        </TipsItem>
        <TipsItem>
          <TipsLabel>{_t('futures.position.has.currency')}</TipsLabel>
          <TipsValue>{amountVal}</TipsValue>
        </TipsItem>
        <TipsItem>
          <TipsLabel>{_t('futures.position.has.value')}</TipsLabel>
          <TipsValue>
            <PrettyCurrency isShort value={positionMarkValue} currency={settleCurrency} />
          </TipsValue>
        </TipsItem>
      </TipsContent>
    ),
    [amountVal, currentQty, positionMarkValue, settleCurrency],
  );

  return (
    <Fragment>
      {!isFold && (
        <QtyCellWrapper>
          {amount} {showUnit}
        </QtyCellWrapper>
      )}
      {isFold && (
        <Text tips={foldTips}>
          {amount} {showUnit}
        </Text>
      )}
    </Fragment>
  );
};

export default memo(QtyCell);
