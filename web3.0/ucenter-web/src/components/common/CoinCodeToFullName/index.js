/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { connect } from 'react-redux';

const CoinCodeToFullName = (props) => {
  const { coinDict, coin } = props;
  const coinObj = coinDict[coin];

  return <React.Fragment>{coinObj ? coinObj.name : coin}</React.Fragment>;
};

export default connect((state) => {
  return {
    coinDict: state.categories,
  };
})(CoinCodeToFullName);
