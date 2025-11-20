/**
 * Owner: borden@kupotech.com
 */
import React from 'react';
import { connect } from 'dva';

const CoinCodeToName = (props) => {
  const { coinDict, coin } = props;
  const coinObj = coinDict[coin];
  return <React.Fragment>{coinObj ? coinObj.currencyName : coin}</React.Fragment>;
};

export default connect((state) => {
  return {
    coinDict: state.categories,
  };
})(CoinCodeToName);
