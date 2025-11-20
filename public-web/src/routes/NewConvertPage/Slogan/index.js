/**
 * Owner: Ray.Lee@kupotech.com
 */
import { ICHistoryOutlined } from '@kux/icons';
import { Button, styled, ThemeProvider, useEventCallback } from '@kux/mui';
import { colors } from '@kux/mui/themes';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Flex, Text } from 'src/components/Flex';
import { useSelector } from 'src/hooks/useSelector';
import { push } from 'src/utils/router';
import BannerBg from 'static/convert/banner_bg.svg';
import BannerBgSmall from 'static/convert/banner_bg_small.svg';
import { addLangToPath, _t } from 'tools/i18n';
import { CenterWrapBox } from '../index';

const { text, text40, text20, cover16 } = colors.dark;

const Wrapper = styled.div`
  height: 160px;
  position: relative;

  display: flex;
  align-items: center;
  justify-content: space-between;

  ${(props) => props.theme.breakpoints.down('lg')} {
    font-size: 16px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    height: 120px;
    font-size: 12px;
    background-size: cover;
  }

  &::before {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: url(${BannerBg}) #000 no-repeat;
    background-size: cover;
    content: '';
    pointer-events: none;

    [dir='rtl'] & {
      transform: scale(-1);
    }

    ${(props) => props.theme.breakpoints.down('sm')} {
      background: url(${BannerBgSmall}) #000 no-repeat;
      background-size: cover;
    }
  }
`;

const Border = styled.span`
  width: 1px;
  height: 20px;
  background: ${cover16};
  margin: 0 20px;

  ${(props) => props.theme.breakpoints.down('sm')} {
    height: 12px;
    margin: 0 8px;
  }
`;

const Title = styled(Text)`
  font-size: 40px;

  color: ${text};
  font-weight: 600;
  line-height: 130%;
  margin-bottom: 12px;

  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-bottom: 9px;
    font-size: 28px;
  }
`;

const Desc = styled(Text)`
  font-size: 20px;

  color: ${text40};
  line-height: 130%;

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 12px;
  }
`;

const Link = styled(Flex)`
  background-color: ${text20};
  border-radius: 60px;
  padding: 9.5px 20px;
  font-size: 16px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 12px;
  }
`;

export default ({ symbol }) => {
  const symbolsInfoMap = useSelector((state) => state.market.symbolsInfoMap); // 全部可用币对
  const loadingAllRecords = useSelector((state) => state.loading.effects['market/pull']);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: 'market/pull' });
  }, [dispatch]);

  const gotoTrade = useEventCallback(() => {
    // 默认TO币种/USDT（依次默认顺序USDT、USDC、BTC、ETH）
    // 若当前To币种为USDT时，默认币币交易对为From/USDT交易对
    // 考虑多租户 判断U要用_BASE_CURRENCY_
    const coins = symbol?.split('-') ?? [];
    if (loadingAllRecords || coins.length !== 2) {
      return;
    }
    const [convertFrom, convertTo] = coins;
    const quoteList = Array.from(
      new Set([window._BASE_CURRENCY_, 'USDT', 'USDC', 'BTC', 'ETH']),
    );
    const base = convertTo === window._BASE_CURRENCY_ ? convertFrom : convertTo;
    const quote = quoteList.find((quote) => !!symbolsInfoMap[`${base}-${quote}`]);
    const choosedSymbol = quote ? `${base}-${quote}` : '';
    push(`/trade/${choosedSymbol}`);
  });
  return (
    <Wrapper data-inspector="convert_slogan">
      <CenterWrapBox>
        <Flex column="column">
          <Flex vc sb>
            <Title>{_t('convert.form.step1.title')}</Title>
            <Flex>
              <Link
                customColor={text}
                as="a"
                fw="500"
                lh="130%"
                vc
                href={addLangToPath('/order/trade/convert')}
                target="_blank"
              >
                <ICHistoryOutlined style={{ marginRight: '8px' }} />
                {_t('convert.form.order.link')}
              </Link>
              <ThemeProvider theme="dark">
                <Button style={{ marginLeft: '8px' }} variant="outlined" onClick={gotoTrade}>
                  {_t('kyc.coin.transaction')}
                </Button>
              </ThemeProvider>
            </Flex>
          </Flex>
          <Flex vc>
            <Desc>{_t('5UoUji8yQgm9qSDZjADU5i')}</Desc>
            <Border />
            <Desc>{_t('xbGpvUjHGaRLo6ySt26KHm')}</Desc>
            <Border />
            <Desc>{_t('sTVcSB91M5t1Lq9juanyxj')}</Desc>
          </Flex>
        </Flex>
      </CenterWrapBox>
    </Wrapper>
  );
};
