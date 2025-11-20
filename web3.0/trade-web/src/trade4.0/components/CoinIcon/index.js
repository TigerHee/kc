/**
 * Owner: borden@kupotech.com
 */
import React from 'react';
import { connect } from 'dva';
import styled from '@emotion/styled';
import { PLACEHOLDER_IMAGE } from '@/meta/const';

export const Wrapper = styled.div`
  display: inline-flex;
  align-items: center;

  > img {
    border-radius: 50%;
    margin-right: 3px;
  }
`;

const CoinIcon = ({
  dispatch,
  currency,
  className,
  categories,
  size = 18,
  showName = true,
  ...rest
}) => {
  // if (!categories[currency]) return null;

  const src = categories[currency]?.iconUrl;

  if (!showName) {
    return (
      <img
        width={size}
        height={size}
        src={src || PLACEHOLDER_IMAGE}
        className={className}
        {...rest}
      />
    );
  }
  return (
    <Wrapper className={className} {...rest}>
      <img width={size} height={size} src={src || PLACEHOLDER_IMAGE} />
      <span>{categories[currency]?.currencyName}</span>
    </Wrapper>
  );
};

export default connect((state) => {
  return {
    categories: state.categories,
  };
})(CoinIcon);
