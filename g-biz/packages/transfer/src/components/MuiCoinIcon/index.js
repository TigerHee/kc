/**
 * Owner: solar@kupotech.com
 */
import React from 'react';
import { styled } from '@kufox/mui';
import { withStateHoc } from '../../hooks/useStateSelector';

const Root = styled.div`
  display: flex;
  align-items: center;
`;

const Image = styled.img`
  border-radius: 50%;
  margin-right: 5px;
  [dir='rtl'] & {
    margin-left: 5px;
  }
`;

const CoinIcon = ({
  dispatch,
  currency,
  className,
  context,
  size = 18,
  showName = true,
  ...rest
}) => {
  const { categories } = context;
  const src = (categories[currency] || {}).iconUrl;

  if (!categories[currency]) return null;

  if (!showName) {
    return <Image width={size} height={size} src={src} {...rest} />;
  }
  return (
    <Root className={className} {...rest}>
      {!!categories[currency].iconUrl && (
        // <span>
        <Image width={size} height={size} src={src} />
        // &nbsp;
        // </span>
      )}
      <span
      // style={{
      //   marginLeft: categories[currency].iconUrl ? 0 : size + 5,
      // }}
      >
        {categories[currency].currencyName}
      </span>
    </Root>
  );
};

// export default connect((state) => {
//   return {
//     categories: state.categories,
//   };
// })(CoinIcon);

export default withStateHoc(CoinIcon);
