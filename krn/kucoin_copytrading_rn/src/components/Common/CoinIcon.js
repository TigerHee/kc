import React from 'react';
import {useSelector} from 'react-redux';
import styled from '@emotion/native';

const Img = styled.Image``;

const CoinIcon = ({coin, size = 24, style}) => {
  const categories = useSelector(state => state.symbols.categories) || {};
  const coinObj = categories[coin] || {};
  return (
    <Img
      source={{uri: coinObj.iconUrl, width: size, height: size}}
      style={style}
    />
  );
};

export default CoinIcon;
