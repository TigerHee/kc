/**
 * Owner: willen@kupotech.com
 */
import { multiply, separateNumber } from 'helper';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

/**
 * 法币价值转换
 * @param coinType 当前数据币种
 * @param children 当前币种数量
 * @param className 样式
 * @param defaultResult 默认值
 * @param currency 目标法币，默认来源为当前选择的法币
 * @param rates 法币对USD的汇率，默认全局数据
 * @param prices 数字货币对应的法币价值，默认全局数据
 * @param showType 展示方式，默认 0 为货币符号接数量，1 为约等于数量接货币名，
 * @param amountClassName 数量的样式
 * @returns {XML}
 * @constructor
 */

const Currency = ({
  coinType,
  children,
  className,
  defaultResult,
  currency,
  rates,
  coinPrice,
  prices,
  showType,
  amountClassName,
}) => {
  const price = coinPrice || prices[coinType]; // 当前币种对应当前法币的价值

  if (!price || children === null) {
    return <span className={className}>{defaultResult}</span>;
  }

  if (+showType === 1) {
    return (
      <span className={className}>
        <span>≈</span>
        &nbsp;
        <span className={amountClassName}>{separateNumber(multiply(price, children, 2))}</span>
        &nbsp;
        <span>{currency}</span>
      </span>
    );
  }

  if (+showType === 2) {
    return (
      <span className={className}>
        <span className={amountClassName}>{separateNumber(multiply(price, children, 2))}</span>
      </span>
    );
  }

  if (+showType === 3) {
    return (
      <span className={className}>
        <span className={amountClassName}>{separateNumber(multiply(price, children, 2))}</span>
        &nbsp;
        <span>{currency}</span>
      </span>
    );
  }

  return (
    <span className={className}>
      <span className={amountClassName}>
        {separateNumber(multiply(price * rates[currency], 1, 2))}
      </span>
      &nbsp;
      <span>{currency}</span>
    </span>
  );
};

Currency.propTypes = {
  children: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

Currency.defaultProps = {
  defaultResult: null,
  showType: null,
  children: null,
};

export default connect((state) => {
  return {
    currency: state.currency.currency,
    // currencies: state.currency.map,
    prices: state.currency.prices,
    rates: state.currency.rates,
  };
})(Currency);
