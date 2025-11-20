import React from 'react';
import {useSelector} from 'react-redux';

const CoinCodeToName = ({coin}) => {
  const coinDict = useSelector(state => state.symbols.categories) || {};
  const coinObj = coinDict[coin];
  return (
    <React.Fragment>{coinObj ? coinObj.currencyName : coin}</React.Fragment>
  );
};

export default CoinCodeToName;
