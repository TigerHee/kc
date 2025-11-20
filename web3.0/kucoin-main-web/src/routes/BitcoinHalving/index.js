/**
 * Owner: ella@kupotech.com
 */
import React, { useEffect } from 'react';
import { useResponsive } from '@kux/mui';
import OgImage from 'components/Seo/OgImage';
import { useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { _t, _tHTML } from 'tools/i18n';
import share from 'static/bitcoin-halving/share.png';
import { Wrapper, Content } from './index.style';
import Banner from './components/Banner';
import ShareSign from './components/ShareSign';
import Article from './components/Article';

const symbol = 'BTC-USDT';
const param = {
  coin: 'BTC',
  legalCurrency: 'USD',
  source: 'WEB',
  symbol: symbol,
};

export default () => {
  const responsive = useResponsive();
  const dispatch = useDispatch();
  const { isLogin } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch({
      type: 'bitcoinHalving/getCoinInfo',
      payload: param,
    });
    dispatch({
      type: 'bitcoinHalving/getStatsBySymbol',
      payload: {
        bestSymbol: symbol,
      },
    });
  }, [dispatch]);

  return (
    <Wrapper data-inspector="seo_bitcoin_halving">
      <OgImage imgSrc={share} />
      <Banner />
      <Content>
        <ShareSign />
        <Article />
      </Content>
    </Wrapper>
  );
};
