/**
 * Owner: garuda@kupotech.com
 * 调整杠杆-标题
 */
import React from 'react';

import SymbolText from '@/components/SymbolText';
import { styled, _t } from '@/pages/Futures/import';


import { SymbolBox } from '../commonStyle';

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
  .symbol-box {
    margin-bottom: 30px;
  }
`;

const Title = ({ symbol }) => {
  return (
    <TitleBox>
      <h3>{_t('adjust.position.leverage')}</h3>
      {symbol ? (
        <SymbolBox className="symbol-box">
          <SymbolText className="symbol-text" symbol={symbol} />
        </SymbolBox>
      ) : null}
    </TitleBox>
  );
};

export default React.memo(Title);
