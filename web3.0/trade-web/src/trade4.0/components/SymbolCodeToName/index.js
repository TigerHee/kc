/**
 * Owner: borden@kupotech.com
 * 将交易对code转换为展示用的name
 */
import SettleDateTip from '@/pages/Futures/components/SettleDateTip/SettleDateTip';
import { useSelector } from 'dva';
import React, { Fragment } from 'react';
import { FUTURES } from 'src/trade4.0/meta/const';
import { styled } from 'src/trade4.0/style/emotion';
import SymbolText from '../SymbolText';

const SymbolBox = styled.div`
  display: flex;
  align-items: center;
  .font14 {
    margin-left: 8px;
    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

const FuturesSymbol = ({ symbol, isFuturesShowSettle, ...rest }) => {
  return (
    <SymbolBox>
      <SymbolText symbol={symbol} {...rest} />
      {isFuturesShowSettle ? (
        <SettleDateTip className="font14" symbol={symbol} showText={false} />
      ) : null}
    </SymbolBox>
  );
};

const Wrapper = styled.div`
  display: flex;
`;

const SymbolCodeToName = (props) => {
  const { code, divide = '/', tradeType, dir, ...rest } = props;
  const symbolsMap = useSelector((state) => state.symbols.symbolsMap);

  const { symbol } = symbolsMap[code] || {};
  const displaySymbol = symbol ? symbol.replace('-', divide) : code.replace('-', divide);
  const beforeSymbol = displaySymbol.split(divide)[0];
  const afterSymbol = displaySymbol.split(divide)[1];

  // 合约
  if (tradeType === FUTURES) {
    return <FuturesSymbol symbol={code} {...rest} />;
  }

  if (dir) {
    return (
      <Wrapper dir={dir} className="symbol-code-wrapper">
        <span className="symbolCodeToName">{beforeSymbol}</span>
        {divide}
        {afterSymbol}
      </Wrapper>
    );
  }
  // 其他类型交易对
  return (
    <Fragment>
      <span className="symbolCodeToName">{beforeSymbol}</span>
      {divide}
      {afterSymbol}
    </Fragment>
  );
};

export default React.memo(SymbolCodeToName);
