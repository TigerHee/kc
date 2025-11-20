/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { connect } from 'react-redux';
import { styled } from '@kufox/mui';

const IconWrapper = styled.div`
  border-radius: 50%;
  background: #e9edef;
  text-align: center;
  vertical-align: middle;
  display: inline-block;
  margin-right: 8px;
`;

const CoinIcon = (props) => {
  const { coin, categories, dispatch, maskConfig, ...rest } = props;
  const coinObj = categories[coin] || {};
  if (typeof maskConfig === 'object') {
    const { size, maskStyle = {}, ...other } = maskConfig;
    return (
      <IconWrapper
        style={{
          width: size,
          height: size,
          ...maskStyle,
        }}
        {...rest}
      >
        <img
          alt=""
          src={coinObj.iconUrl}
          style={{
            width: size - 4,
            height: size - 4,
          }}
          {...other}
        />
      </IconWrapper>
    );
  }
  return <img alt="" src={coinObj.iconUrl} {...rest} />;
};

export default connect((state) => {
  return {
    categories: state.categories,
  };
})(CoinIcon);
