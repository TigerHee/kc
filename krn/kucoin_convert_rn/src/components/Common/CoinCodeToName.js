/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import {useSelector} from 'react-redux';
import HighlightText from './HighlightText';

const CoinCodeToName = ({coin, keywords, maxLength}) => {
  const coinDict = useSelector(state => state.symbols.categories) || {};
  const coinObj = coinDict[coin];
  const name = (coinObj ? coinObj.currencyName : coin) || '';
  // 根据 maxLength 做截取 大于+...
  const _name = maxLength
    ? name.length <= maxLength
      ? name
      : `${name.substring(0, maxLength)}...`
    : name;
  return <HighlightText allText={_name} keywords={keywords} />;
};

export default CoinCodeToName;
