/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-06-12 17:25:10
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-07-18 18:36:47
 * @FilePath: /trade-web/src/components/common/CoinIcon/index.js
 * @Description: 币种图片
 */
/**
 * Owner: borden@kupotech.com
 */
import React from 'react';
import { connect } from 'dva';
import clxs from 'classnames';
import styles from './styles/style.less';

// 未用到
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

  const src = _DEV_
    ? 'https://assets.staticimg.com/www/coin/pc/BTC.png'
    : categories[currency].iconUrl;

  if (!showName) {
    return (
      <img
        width={size}
        height={size}
        src={src}
        className={className}
        {...rest}
      />
    );
  }
  const cls = clxs(styles.root, className);
  return (
    <div className={cls} {...rest}>
      {!!categories[currency].iconUrl && (
        <img
          width={size}
          height={size}
          src={src}
        />
      )}
      <span>{categories[currency].currencyName}</span>
    </div>
  );
};

export default connect((state) => {
  return {
    categories: state.categories,
  };
})(CoinIcon);
