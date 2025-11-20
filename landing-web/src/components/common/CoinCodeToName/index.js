/**
 * Owner: jesse.shao@kupotech.com
 */
/*
 * @Author: Chrise
 * @Date: 2021-07-05 15:18:59
 * @FilePath: /landing-web/src/components/common/CoinCodeToName/index.js
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
