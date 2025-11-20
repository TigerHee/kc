/*
  * owner: borden@kupotech.com
 */
import React, { Fragment } from 'react';
import styled from '@emotion/styled';
import useMarginModel from '@/hooks/useMarginModel';

export const Leverage = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 0 2px;
  height: 16px;
  font-weight: 500;
  font-size: 12px;
  line-height: 130%;
  border-radius: 2px;
  margin-left: 4px;
  color: ${props => props.theme.colors.textPrimary};
  background: ${props => props.theme.colors.primary12};
  -webkit-text-stroke: transparent;
`;

const LabelWithLeverage = React.memo(({ leverage, tradeType, children }) => {
  const { accountConfigs } = useMarginModel(['accountConfigs'], { tradeType });

  if (!leverage) {
    leverage = accountConfigs?.maxLeverage;
  }

  return (
    <Fragment>
      {children}
      {Boolean(leverage) && <Leverage>{leverage}x</Leverage>}
    </Fragment>
  );
});

export default LabelWithLeverage;
