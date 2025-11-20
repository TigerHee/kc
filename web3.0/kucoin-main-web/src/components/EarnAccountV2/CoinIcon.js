/**
 * Owner: chris@kupotech.com
 */
import React from 'react';
import { connect } from 'react-redux';
import { styled } from '@kufox/mui';

const Root = styled.div`
  display: inline-flex;
  align-items: center;
`;

const Image = styled.img`
  border-radius: 50%;
  margin-right: 5px;
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
  const src = (categories[currency] || {}).iconUrl;

  if (!categories[currency]) return null;

  if (!showName) {
    return <Image width={size} height={size} src={src} {...rest} />;
  }
  return (
    <Root className={className} {...rest}>
      {!!categories[currency].iconUrl && <Image width={size} height={size} src={src} />}
      <span
        style={{
          marginLeft: categories[currency].iconUrl ? 0 : size + 5,
        }}
      >
        {categories[currency].currencyName}
      </span>
    </Root>
  );
};

export default connect((state) => {
  return {
    categories: state.earnAccount.categoriesEarn,
  };
})(CoinIcon);
