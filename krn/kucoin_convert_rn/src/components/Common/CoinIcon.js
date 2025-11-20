/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import styled from '@emotion/native';
import {useSelector} from 'react-redux';

const Img = styled.Image``;

const CoinIcon = ({coin, size = 24, style}) => {
  const categories = useSelector(state => state.symbols.categories) || {};
  const coinObj = categories[coin] || {};
  return (
    <Img
      source={{uri: coinObj.iconUrl, width: size, height: size}}
      style={[{width: size, height: size}, style]}
      autoRotateDisable
    />
  );
};

export default CoinIcon;
