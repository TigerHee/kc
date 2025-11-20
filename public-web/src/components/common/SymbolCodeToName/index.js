/**
 * Owner: willen@kupotech.com
 */
/**
 * 将交易对code转换为展示用的name
 */
import React from 'react';
import { connect } from 'react-redux';

const INVALID_TIME = 5000;
const codeCache = {};

// 缓存结果避免多次查找
const cache = (WrappedComponent) => {
  return (props) => {
    const { code } = props;
    const cached = codeCache[code];
    if (cached) {
      const now = Date.now();
      const invalid = now - cached.timestamp > INVALID_TIME; // 计算缓存时间，如果缓存失效，更新缓存
      if (invalid) {
        return <WrappedComponent {...props} />;
      }
      return cached.result;
    }
    return <WrappedComponent {...props} />;
  };
};

const SymbolCodeToName = (props) => {
  const { code, symbols, divide = '/' } = props;
  const symbol = symbols.find((s) => s.code === code);
  const result = (
    <React.Fragment>
      {symbol ? symbol.symbol.replace('-', divide) : code.replace('-', divide)}
    </React.Fragment>
  );
  codeCache[code] = {
    result,
    timestamp: Date.now(),
  };
  return result;
};

export default cache(
  connect((state) => {
    const { records } = state.market;
    return {
      symbols: records,
    };
  })(SymbolCodeToName),
);
