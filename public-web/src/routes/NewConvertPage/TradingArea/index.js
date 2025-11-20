/*
 * owner: borden@kupotech.com
 */
import { styled } from '@kux/mui';
import React from 'react';
import Chart from './Chart';
import Convert from './Convert';

const Container = styled.div`
  margin-top: 64px;
  display: flex;
  justify-content: ${({ isLimitOrder }) => (isLimitOrder ? 'space-between' : 'center')};
  ${(props) => props.theme.breakpoints.down('lg')} {
    flex-direction: column;
    margin-top: 56px;
    margin-bottom: 80px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 32px;
    margin-bottom: 48px;
  }
`;
const LeftBox = styled.div`
  width: 660px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 100%;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    display: none;
  }
`;
const RightBox = styled.div`
  width: 468px;
  min-height: 521.19px;
  border-radius: 20px;
  height: fit-content;
  position: relative;
  border: 1px solid ${(props) => props.theme.colors.cover12};
  background: ${(props) => props.theme.colors.overlay};
  padding: 36px 28px 32px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    margin: 40px auto 0;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 100%;
    min-height: 456px;
    margin: 0;
    padding: 24px 16px 28px;
  }
`;

const TradingArea = ({ symbol, setSymbol, isLimitOrder, setIsLimitOrder }) => {
  return (
    <Container isLimitOrder={isLimitOrder}>
      {isLimitOrder && (
        <LeftBox data-inspector="convert_limit_chart">
          <Chart symbol={symbol} />
        </LeftBox>
      )}
      <RightBox>
        <Convert
          setSymbol={setSymbol}
          style={{ minHeight: '100%' }}
          setIsLimitOrder={setIsLimitOrder}
        />
      </RightBox>
    </Container>
  );
};

export default React.memo(TradingArea);
