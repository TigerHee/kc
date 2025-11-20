/**
 * Owner: charles.yang@kupotech.com
 */
import React, { memo, Fragment, useMemo } from 'react';

import { FUTURES } from 'src/trade4.0/meta/const';
import { multiply } from 'src/utils/operation';

import Text from '@/components/Text';

import {
  useI18n,
  PrettyCurrency,
  styled,
  fx,
  useGetSymbolInfo,
  useGetPositionCalcData,
  formatCurrency,
  thousandPointed,
  useSymbolUnit,
  useTransformAmount,
} from '@/pages/Futures/import';

import { quantityPlaceholder } from '@/utils/futures';


const QtyCellWrapper = styled.div`
  .text-tip {
    color: ${(props) => props.theme.colors.text};
  }
`;

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
  const { _t } = useI18n();
  const { currentQty, symbol, markValue, isTrialFunds } = row;
  const { unit: showUnit } = useSymbolUnit({ symbol });
  const { multiplier, isInverse, baseCurrency, settleCurrency, quoteCurrency } = useGetSymbolInfo({
    symbol,
    tradeType: FUTURES,
  });
  const { quantityToBaseCurrency } = useTransformAmount({ tradeType: FUTURES, symbol });

  // 用来显示
  const amount = thousandPointed(quantityToBaseCurrency(currentQty));
  const baseCurrencyAmount = multiply(currentQty)(multiplier || 0).toString();
  const amountVal = isInverse
    ? `${amount} ${formatCurrency(quoteCurrency)}`
    : `${thousandPointed(baseCurrencyAmount)} ${formatCurrency(baseCurrency)}`;

  const calcData = useGetPositionCalcData(symbol);
  // 体验金的仓位不需要计算，有推送
  const positionMarkValue = isTrialFunds ? markValue : calcData?.markValue || markValue;

  const foldTips = useMemo(
    () => (
      <TipsContent>
        <TipsItem>
          <TipsValue>{quantityPlaceholder({ baseCurrency, isInverse, multiplier, quoteCurrency }, _t)}</TipsValue>
        </TipsItem>
        <TipsItem>
          <TipsLabel>{_t('futures.position.has.unit')}</TipsLabel>
          <TipsValue>{`${thousandPointed(currentQty)} ${_t('global.unit')}`}</TipsValue>
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
    [
      _t,
      amountVal,
      baseCurrency,
      currentQty,
      isInverse,
      multiplier,
      positionMarkValue,
      settleCurrency,
    ],
  );

  return (
    <Fragment>
      <QtyCellWrapper className="text-color">
        <Text
          tips={
            isFold ? (
              foldTips
            ) : (
              <TipsValue>
                {quantityPlaceholder({ baseCurrency, isInverse, multiplier }, _t)}
              </TipsValue>
            )
          }
        >
          {`${amount} ${showUnit}`}
        </Text>
      </QtyCellWrapper>
    </Fragment>
  );
};

export default memo(QtyCell);
