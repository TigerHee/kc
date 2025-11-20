/**
 * Owner: garuda@kupotech.com
 */
import React, { useMemo } from 'react';

import { useResponsive } from '@kux/mui';

import { styled, _t } from '../../../builtinCommon';

const ResultBox = styled.div`
  position: relative;
  padding: 16px;
  background-color: ${(props) => props.theme.colors.cover2};
  border-radius: 8px;
  height: 100%;

  h3 {
    padding: 0;
    margin: 0 0 16px;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.3;
    color: ${(props) => props.theme.colors.text};
  }

  .resultContent {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-between;
  }

  .calculator-item {
    margin-bottom: 16px;
  }

  .resultFooter {
    position: absolute;
    left: 0;
    bottom: 16px;
    margin: 0;
    padding: 0 16px;
  }
`;

const ResultFooter = styled.div`
  margin: 14px 4px 0;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.3;
  color: ${(props) => props.theme.colors.text40};
`;

const CalcResultBox = ({ children }) => {
  const { xs, sm } = useResponsive();
  const isMobile = useMemo(() => xs && !sm, [sm, xs]);

  return (
    <>
      <ResultBox>
        <h3>{_t('calc.result')}</h3>
        <div className={'resultContent'}>{children}</div>
        {!isMobile ? (
          <ResultFooter className="resultFooter">{_t('calc.notice')}</ResultFooter>
        ) : null}
      </ResultBox>
      {isMobile ? <ResultFooter>{_t('calc.notice')}</ResultFooter> : null}
    </>
  );
};

export default React.memo(CalcResultBox);
