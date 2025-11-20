/**
 * Owner: solar@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { styled } from '@kux/mui';
import numberFormat from '@kux/mui/utils/numberFormat';
import { CURRENCY_CHARS } from 'config/base';
import { multiplyFloor } from 'helper';
import { useCallback, useMemo } from 'react';
import CountUp from 'react-countup';
import NoSSG from 'src/components/NoSSG';
import { useSelector } from 'src/hooks/useSelector';
import bannerBottomRightImg from 'static/rocket_zone/banner_bottom_right.png';
import bannerTopLeftImg from 'static/rocket_zone/banner_top_left.png';
import { _t } from 'tools/i18n';
import Header from 'TradeActivityCommon/AppHeader';
import AnimateElement from '../../components/AnimateElement';
import { useResponsiveSize } from '../../hooks';

const StyledBanner = styled.div`
  background-image: url(${(props) => props.bg});
  background-size: cover;
  position: relative;
  .banner-top-left {
    position: absolute;
    top: 0;
  }
  .banner-bottom-right {
    position: absolute;
    bottom: 0;
  }
  .main-title {
    ${(props) => props.theme.fonts.size.x4l};
    margin-bottom: 0px;
    color: #f3f3f3;
    font-weight: 700;
  }
  .sub-title {
    margin-top: 8px;
    margin-bottom: 20px;
    color: rgba(243, 243, 243, 0.4);
    font-size: 14px;
  }
  .container {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    padding: 16px 16px 32px;
  }
  .app-header {
    height: 50px;
    .arrow-back {
      position: absolute;
      top: 50px;
      left: 16px;
      z-index: 10;
    }
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    .main-title {
      padding-right: 240px;
      font-size: 36px;
    }
    .sub-title {
      margin-top: 6px;
      margin-bottom: 32px;
      padding-right: 240px;
      font-weight: 500;
      font-size: 16px;
    }
    padding: 60px 0px;
    .container {
      box-sizing: border-box;
      padding: 0 24px;
      .rocket_zone_icon {
        position: absolute;
        top: 50%;
        right: 24px;
        width: 220px;
        height: 220px;
        transform: translateY(-50%);
      }
    }
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    .main-title {
      ${(props) => props.theme.fonts.size.x8l};
      padding-right: 360px;
    }
    .sub-title {
      margin-top: 8px;
      padding-right: 360px;
      font-size: 24px;
    }
    .container {
      width: 1200px;
      margin: 0 auto;
      padding: 0;
      .rocket_zone_icon {
        position: absolute;
        right: 40px;
        width: 250px;
        height: 250px;
      }
    }
  }
`;

const TradeDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  ${(props) => props.theme.breakpoints.up('sm')} {
    width: 240px;
    height: 104px;
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    width: 240px;
    height: 104px;
  }
`;

const TradeInfo = styled.div`
  display: flex;
  width: auto;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
  justify-content: space-between;
  .number-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    align-items: flex-start;
    &.second-info {
      align-items: flex-end;
    }
    .number-title {
      color: #f3f3f3;
      color: #f3f3f3;
      font-weight: 700;
      font-size: 16px;
      font-family: Roboto;
      font-style: normal;
      line-height: 130%;
    }
    .number-des {
      color: rgba(243, 243, 243, 0.4);
      font-weight: 400;
      font-size: 12px;
      font-family: Roboto;
      font-style: normal;
      line-height: 130%;
    }
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    gap: 16px;
    justify-content: flex-start;
    .number-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
      align-items: flex-start;
      &.second-info {
        align-items: flex-start;
      }
      .number-title {
        color: #f3f3f3;
        font-weight: 700;
        font-size: 18px;
        font-family: Roboto;
        font-style: normal;
        line-height: 130%;
      }
      .number-des {
        color: rgba(243, 243, 243, 0.4);
        font-weight: 400;
        font-size: 12px;
        font-family: Roboto;
        font-style: normal;
        line-height: 130%;
      }
    }
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    gap: 16px;
    justify-content: flex-start;
    .number-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
      align-items: flex-start;
      &.second-info {
        align-items: flex-start;
      }
      .number-title {
        color: #f3f3f3;
        font-weight: 700;
        font-size: 20px;
        font-family: Roboto;
        font-style: normal;
        line-height: 130%;
      }
      .number-des {
        font-size: 14px;
        font-family: Roboto;
        font-style: normal;
        line-height: 130%;
      }
    }
  }
`;

const findSource = (() => {
  const requireContext = require.context('static/rocket_zone', false, /^\.\/.*\.png$/);
  return function (filename) {
    return requireContext(`./${filename}`);
  };
})();

function useBg() {
  const size = useResponsiveSize();
  const filename = useMemo(() => {
    if (size === 'sm') return 'banner_sm.png';
    return 'banner_lg.png';
  }, [size]);
  return findSource(filename);
}

export default function Banner() {
  const bg = useBg();
  const size = useResponsiveSize();
  const isSm = size === 'sm';
  const bannerInfo = useSelector((state) => state.rocketZone.gemspaceBanner);
  const { currentLang } = useLocale();

  const currency = useSelector((state) => state.currency.currency); // 当前用户选择的法币单位
  const selected = CURRENCY_CHARS.filter((item) => item.currency === currency)[0]; // 对应金融符号
  const legalChars = selected ? `${selected.char}` : '';
  const prices = useSelector((state) => state.currency.prices); // 转换比例

  const formattingFn = useCallback(
    (number) => {
      const totalParticipants = numberFormat({
        number: number,
        lang: currentLang,
      });
      return totalParticipants;
    },
    [currentLang],
  );

  const formattingPrice = useCallback(
    (number) => {
      const rate = prices['USDT']; // 转换比例
      const target = multiplyFloor(rate || 1, number, 2);
      const totalPrice = numberFormat({
        number: target,
        lang: currentLang,
        currency: legalChars,
        options: { maximumFractionDigits: 0 },
      });
      return totalPrice;
    },
    [prices, currentLang, legalChars],
  );

  const formattingPercent = useCallback(
    (number) => {
      const totalPercent = numberFormat({
        number: number,
        lang: currentLang,
        options: {
          style: 'percent',
        },
      });
      return totalPercent;
    },
    [currentLang],
  );

  return (
    <StyledBanner bg={bg} data-inspector="inspector_gemspace_banner">
      {/* 在中大屏中两个小图标分别切图定位 */}
      {!isSm && (
        <>
          <img
            src={bannerTopLeftImg}
            className="banner-top-left"
            style={{ left: 0 }}
            alt="banner img"
          />
          <img
            src={bannerBottomRightImg}
            className="banner-bottom-right"
            style={{ right: 0 }}
            alt="banner img"
          />
        </>
      )}
      <NoSSG>
        <Header title={_t('m1wBqBxwpfRxTcpvavZ7ui')} titleInitTransparent={true} />
      </NoSSG>
      <div className="container">
        {!isSm && (
          <AnimateElement
            className="rocket_zone_icon"
            load={() => import('src/components/RocketZone/lottie/rocket_icon.json')}
            loop={true}
          />
        )}
        <h1 className="main-title">{_t('m1wBqBxwpfRxTcpvavZ7ui')}</h1>
        <h2 className="sub-title">{_t('a01c7223b2294000a0a2')}</h2>
        <TradeInfo>
          <TradeDiv isSm={isSm}>
            <div className="number-info">
              <div className="number-title amountClassName">
                {bannerInfo?.totalParticipants ? (
                  <CountUp
                    start={0}
                    end={bannerInfo?.totalParticipants || 0}
                    duration="4"
                    //decimals={2}
                    prefix=""
                    suffix=""
                    formattingFn={formattingFn}
                  />
                ) : (
                  '--'
                )}
              </div>
              <div className="number-des">{_t('p3JhVJLstEK9uoBua4mVpp')}</div>
            </div>

            <div className="number-info">
              <div className="number-title amountClassName">
                {bannerInfo?.turnover24 ? (
                  <CountUp
                    amountClassName="amountClassName"
                    start={0}
                    decimals={0}
                    end={bannerInfo?.turnover24 || 0}
                    duration="4"
                    formattingFn={formattingPrice}
                  />
                ) : (
                  '--'
                )}
              </div>
              <div className="number-des">{_t('o57H8cec1rb5h26QG5gAQP')}</div>
            </div>
          </TradeDiv>

          <TradeDiv isSm={isSm}>
            <div className="number-info second-info">
              <div className="number-title amountClassName">
                {bannerInfo?.totalPriceSize ? (
                  <CountUp
                    start={0}
                    decimals={0}
                    end={bannerInfo?.totalPriceSize || 0}
                    duration="4"
                    formattingFn={formattingPrice}
                  />
                ) : (
                  '--'
                )}
              </div>
              <div className="number-des">{_t('59VZWU5vGU2Sm1Cc1XC34T')}</div>
            </div>
            <div className="number-info second-info">
              <div className="number-title amountClassName">
                {bannerInfo?.averageRoi ? (
                  <CountUp
                    start={0}
                    decimals={4}
                    end={bannerInfo?.averageRoi || 0}
                    duration="4"
                    formattingFn={formattingPercent}
                  />
                ) : (
                  '--'
                )}
              </div>
              <div className="number-des">{_t('a7QgvpnH7KRpT7uePyKfgu')}</div>
            </div>
          </TradeDiv>
        </TradeInfo>
      </div>
    </StyledBanner>
  );
}
