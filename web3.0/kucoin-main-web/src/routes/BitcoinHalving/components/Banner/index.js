/**
 * Owner: ella@kupotech.com
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useResponsive, NumberFormat } from '@kux/mui';
import { useSelector } from 'src/hooks/useSelector';
import { ICArrowRightOutlined } from '@kux/icons';
import { _t, _tHTML, addLangToPath } from 'tools/i18n';
import { useLocale } from '@kucoin-base/i18n';
import siteConfig from 'utils/siteConfig';
import bannerbg from 'static/bitcoin-halving/bannerbg.png';
import bannerbg2 from 'static/bitcoin-halving/bannerbg2.png';
import bannerbg3 from 'static/bitcoin-halving/bannerbg3.png';
import { getCountdown } from 'services/bitcoinHalving';
import CountDown from '../CountDown';
import BannerPrice from '../BannerPrice';
import {
  Wrapper,
  DesWrapper,
  BannerInfo,
  MdWrapper,
  Title,
  DesInfo,
  Button,
  Text,
  Price,
  Image,
  ContentWapper,
  TimerWrapper,
  TimeInfo,
} from './index.style';

const { KUCOIN_HOST } = siteConfig;
const defaultData = {
  estimatedTime: '',
  removingHeight: '--',
  countDownTime: 0,
};

export default () => {
  const responsive = useResponsive();
  const { tradeData, coinInfo } = useSelector((state) => state.bitcoinHalving);
  const [data, setData] = useState(defaultData);
  const { currentLang } = useLocale();
  const refDes = useRef();
  const [langText, setLangText] = useState(false);

  useEffect(() => {
    getCountdown().then((res) => {
      if (res && res.success && res.data) {
        setData({
          estimatedTime: res.data.estimatedTime,
          removingHeight: res.data.removingHeight,
          countDownTime: res.data.countDownTime,
        });
      }
    });
  }, []);

  const renderButon = useCallback(() => {
    return (
      <Button href={addLangToPath(`${KUCOIN_HOST}/trade/BTC-USDT`)}>
        <img src={coinInfo?.logo} alt="btcicon" />
        <Text>Bitcoin</Text>
        <Price>
          {tradeData?.price ? (
            <React.Fragment>
              $
              <NumberFormat
                options={{
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }}
                lang={currentLang}
              >
                {tradeData?.price}
              </NumberFormat>
            </React.Fragment>
          ) : (
            '--'
          )}
        </Price>
        <ICArrowRightOutlined color="#FFF" />
      </Button>
    );
  }, [tradeData, coinInfo, currentLang]);

  const renderCountDown = useCallback(() => {
    return (
      <TimerWrapper>
        <TimeInfo>{_t('8UQGHRQsfN4Uhscg55hcdz')}</TimeInfo>
        <CountDown countDownTime={data.countDownTime} />
      </TimerWrapper>
    );
  }, [data]);

  useEffect(() => {
    if (refDes.current) {
      const height = refDes.current?.offsetHeight;
      if (height > 100) {
        setLangText(true);
      } else {
        setLangText(false);
      }
    }
  }, []);

  return (
    <Wrapper>
      {!responsive.sm && <Image src={bannerbg3} alt="btc-halving" />}
      <ContentWapper>
        <BannerInfo>
          <DesWrapper>
            <Title>{_t('qc1Y3V7pUFxPW2VmRRECJm')}</Title>
            <DesInfo ref={refDes}>{_t('fXiio56ceS8bGqpHySiUeY')}</DesInfo>
            {responsive.lg || !responsive.sm ? (
              <React.Fragment>
                {renderButon()}
                {renderCountDown()}
              </React.Fragment>
            ) : (
              <MdWrapper>
                <span>
                  {renderButon()}
                  {renderCountDown()}
                </span>
                <Image src={bannerbg2} alt="btc-halving" />
              </MdWrapper>
            )}
          </DesWrapper>
          {responsive.lg && <Image src={bannerbg} alt="btc-halving" />}
        </BannerInfo>
        <BannerPrice
          estimatedTime={data.estimatedTime}
          removingHeight={data.removingHeight}
          langText={langText}
        />
      </ContentWapper>
    </Wrapper>
  );
};
