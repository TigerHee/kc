/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { connect } from 'dva';
import clxs from 'classnames';

const CoinIcon = ({
  dispatch,
  currency,
  className,
  categories,
  size = 18,
  showName = true,
  ...rest
}) => {
  if (!categories[currency]) return null;

  // const src = _DEV_
  //   ? 'https://assets.kucoin.top/www/coin/pc/BTC.png'
  //   : categories[currency].iconUrl;
  const src = categories[currency].iconUrl;

  if (!showName) {
    return <img width={size} height={size} src={src} alt="" {...rest} />;
  }
  const cls = clxs(className);
  return (
    <div
      className={cls}
      {...rest}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        color: '#333',
        '&>img': {
          borderRadius: '50%',
          marginRight: 5,
        },
      }}
    >
      {!!categories[currency].iconUrl && (
        <img alt={categories[currency].currencyName} width={size} height={size} src={src} />
      )}
      <span
        style={{
          marginLeft: categories[currency].iconUrl ? 0 : size + 5,
        }}
      >
        {categories[currency].currencyName}
      </span>
    </div>
  );
};

export default connect((state) => {
  return {
    categories: state.categories,
  };
})(CoinIcon);
