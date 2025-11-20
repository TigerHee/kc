/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { connect } from 'react-redux';

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
