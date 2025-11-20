/**
 * Owner: willen@kupotech.com
 */
import { styled, useTheme } from '@kufox/mui';
import { connect } from 'react-redux';

const Root = styled.div(({ color }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  color: color.highEmphasis,
  '&>img': {
    borderRadius: '50%',
    marginRight: 5,
  },
}));

const CoinIcon = ({
  dispatch,
  currency,
  className,
  categories,
  size = 18,
  showName = true,
  ...rest
}) => {
  // const src = _DEV_
  //   ? 'https://assets.kucoin.top/www/coin/pc/BTC.png'
  //   : categories[currency].iconUrl;
  const src = (categories[currency] || {}).iconUrl;
  const theme = useTheme();

  if (!categories[currency]) return null;

  if (!showName) {
    return <img width={size} height={size} src={src} alt="" {...rest} />;
  }

  return (
    <Root className={className} color={theme.colors} {...rest}>
      {!!categories[currency].iconUrl && <img width={size} height={size} alt="" src={src} />}
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
    categories: state.categories,
  };
})(CoinIcon);
