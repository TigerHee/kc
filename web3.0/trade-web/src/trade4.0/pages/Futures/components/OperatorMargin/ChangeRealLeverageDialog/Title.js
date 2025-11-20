/**
 * Owner: garuda@kupotech.com
 * 调整真实杠杆-标题
 */
import React, { useMemo } from 'react';

import { styled } from '@/style/emotion';

import SymbolText from '@/components/SymbolText';

import { _t } from 'utils/lang';
import { useGetAppendMarginDetail } from '@/hooks/futures/useGetFuturesPositionsInfo';

import { SymbolBox, TradeSideBox } from '../commonStyle';
import { greaterThan } from 'src/utils/operation';

const TitleBox = styled.div`
  display: flex;
  flex-direction: column;
  > h3 {
    margin: 0 0 8px;
    padding: 0;
    font-size: 24px;
    font-weight: 700;
    line-height: 1.3;
    color: ${(props) => props.theme.colors.text};
  }
  .symbol-wrapper {
    margin-bottom: 30px;
  }
`;

const Title = () => {
  const { symbol, size } = useGetAppendMarginDetail();

  const isLong = useMemo(() => greaterThan(size)(0), [size]);

  return (
    <TitleBox>
      <h3>{_t('adjust.position.leverage')}</h3>
      <SymbolBox className="symbol-wrapper">
        <TradeSideBox isLong={isLong}>{_t(isLong ? 'trade.long' : 'trade.short')}</TradeSideBox>
        <SymbolText boxClassName="symbol-text" symbol={symbol} />
      </SymbolBox>
    </TitleBox>
  );
};

export default React.memo(Title);
