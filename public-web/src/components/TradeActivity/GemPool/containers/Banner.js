/**
 * Owner: jessie@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useLocale } from '@kucoin-base/i18n';
import { ICArrowRightOutlined,ICNoviceGuideOutlined,ICShareOutlined } from '@kux/icons';
import { Button,styled,ThemeProvider,useResponsive,useSnackbar } from '@kux/mui';
import numberFormat from '@kux/mui/utils/numberFormat';
import { Link } from 'components/Router';
import { BASE_CURRENCY,CURRENCY_CHARS } from 'config/base';
import { multiplyFloor } from 'helper';
import debounce from 'lodash/debounce';
import isNil from 'lodash/isNil';
import { memo,useCallback,useEffect,useMemo } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import CountUp from 'react-countup';
import { useDispatch } from 'react-redux';
import NoSSG from 'src/components/NoSSG';
import { useSelector } from 'src/hooks/useSelector';
import bannerBgImg from 'static/gempool/bannerBg.png';
import bannerBgAppImg from 'static/gempool/bannerBgApp.png';
import doubleArrowIcon from 'static/gempool/double_arrow.svg';
import { ReactComponent as ShareIcon } from 'static/gempool/new-share-icon.svg';
import shareTipBg from 'static/gempool/share_tip_bg.svg';
import { _t } from 'tools/i18n';
import useShare from 'TradeActivity/hooks/useShare';
import AnimateElement from 'TradeActivityCommon/AnimateElement';
import Header from 'TradeActivityCommon/AppHeader';
import { trackClick } from 'utils/ga';
import { locateToUrl,locateToUrlInApp } from '../../utils';
import useRealInteraction from '../../ActivityCommon/hooks/useRealInteraction';

const StyledBanner = styled.div`
  background: ${(props) => props.theme.colors.overlay};
  position: relative;

  .container {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    width: 100%;
    padding: ${({ isInApp }) => (isInApp ? '12px 16px 24px' : '24px 16px')};
    overflow: hidden;

    .left {
      width: 100%;
      .main-title {
        margin-bottom: 8px;
        color: ${(props) => props.theme.colors.text};
        font-weight: 700;
        font-size: 24px;
        font-style: normal;
        line-height: 130%;
      }
      .sub-title {
        margin-bottom: 16px;
        color: ${(props) => props.theme.colors.text40};
        font-weight: 400;
        font-size: 14px;
        font-style: normal;
        line-height: 130%;
      }
    }

    ${(props) => props.theme.breakpoints.up('sm')} {
      padding: 0 24px;
      .left {
        flex: 1;
        padding: 64px 0;
        // margin-right: 40px;
        .main-title {
          font-size: 36px;
        }
        .sub-title {
          margin-bottom: 24px;
          font-weight: 500;
          font-size: 16px;
        }
      }
      .right {
        width: 300px;
        margin-left: -24px;
        .gempool_icon {
          width: 300px !important;
          height: 300px !important;
          svg {
            width: 300px !important;
            height: 300px !important;
          }
        }
      }
    }
    ${(props) => props.theme.breakpoints.up('lg')} {
      width: 1200px;
      margin: 0 auto;
      padding: 0;
      .left {
        flex: unset;
        width: 720px;
        margin-right: 40px;
        padding: 72px 0 70px;
        .main-title {
          font-size: 48px;
        }
        .sub-title {
          margin-bottom: 32px;
          font-size: 20px;
        }
      }
      .right {
        display: flex;
        flex: 1;
        justify-content: center;
        margin-left: 0;

        .gempool_icon {
          width: 400px !important;
          height: 400px !important;
          svg {
            width: 400px !important;
            height: 400px !important;
          }
        }
      }
    }
  }
  .shareBtn {
    position: relative;
  }
`;
const StyledBannerBg = styled.div`
  position: absolute;
  width: 100%;
  top: ${({ isInApp }) => (isInApp ? '82px' : '0px')};
  left: 0;
  height: ${({ isInApp }) => (isInApp ? 'calc(100% - 82px)' : '100%')};
  background: ${({ isSm }) => (isSm ? `url(${bannerBgAppImg})` : `url(${bannerBgImg})`)};
  background-size: cover;
  background-position: left center;

  ${(props) => props.theme.breakpoints.up('sm')} {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

const TradeInfo = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;

  .number-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    &.second-info {
      align-items: flex-end;
      text-align: right;
    }
    .number-title {
      margin-bottom: 2px;
      color: ${(props) => props.theme.colors.text};
      font-weight: 700;
      font-size: 18px;
      font-style: normal;
      line-height: 130%;
      word-break: break-word;
    }
    .number-des {
      color: ${(props) => props.theme.colors.text40};
      font-weight: 400;
      font-size: 12px;
      font-style: normal;
      line-height: 130%;
    }
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    gap: 40px;
    justify-content: flex-start;
    .number-info {
      width: 220px;
      &.second-info {
        align-items: flex-start;
      }
      .number-title {
        font-size: 24px;
      }
      .number-des {
        font-size: 14px;
      }
    }
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    .number-info {
      width: auto;
      max-width: 300px;
    }
  }
`;

const BtnGroup = styled.div`
  margin-top: 30px;
  button {
    min-width: 98px;
    margin-right: 12px;
    background: ${(props) => props.theme.colors.cover8};
    // color: rgba(243, 243, 243, 0.6);
    // background: rgba(243, 243, 243, 0.08);
    &.shareBtn {
      background: #F3F3F3;
      color: #1d1d1d;
    }
    svg {
      width: 14px;
      height: 14px;
      margin-right: 4px;
      transform: rotateY(0deg);
      [dir='rtl'] & {
        transform: rotateY(180deg);
      }
    }
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    margin-top: 32px;
    button {
      margin-right: 16px;
      // color: #f3f3f3;
      // background: rgba(243, 243, 243, 0.08);

      svg {
        width: 16px;
        height: 16px;
        margin-right: 4px;
      }
    }
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    margin-top: 40px;
    button {
      min-width: 125px;
    }
  }
`;

const ExtraWrapper = styled.div`
  display: flex;
  align-items: center;
  svg {
    width: 20px;
    height: 20px;
    margin-left: 16px;
    color: ${(props) => props.theme.colors.text};
    transform: rotateY(0deg);
    [dir='rtl'] & {
      transform: rotateY(180deg);
    }
  }
`;

const LinkWrapper = styled(Link)`
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.colors.textPrimary};
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 130%;
  margin-top: 16px;
  svg {
    transform: rotate(0deg);
    [dir='rtl'] & {
      transform: rotate(180deg);
    }
  }
`;

const InviteTipWrapper = styled.div`
  pointer-events: none;
  position: absolute;
  display: inline-flex;
  align-items: center;
  text-align: left;
  padding: 4px 12px;
  min-height: 24px;
  border-radius: 34px;
  background: linear-gradient(276deg, #7ffca7 0.89%, #aaff8d 97.34%);
  width: max-content;
  max-width: 250px;
  color: ${(props) => props.theme.colors.textEmphasis};
  font-size: 12px;
  font-weight: 600;
  opacity: 0;
  transform: scale(0.3);
  animation: share-btn-tip-show-animate .3s ease-out 0s forwards;
  @keyframes share-btn-tip-show-animate {
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
  .arrow {
    position: absolute;
    overflow: hidden;
  }
  &.right-top {
    bottom: 45px;
    left: 60%;
    transform-origin: 17px 24px;
    .arrow {  
      bottom: -7.5px;
      z-index: -1;
      left: 17px;
      width: 8px;
      height: 8px;
      &::after {
        width: 6px;
        height: 6px;
        position: absolute;
        background: #a0fe93;
        border-bottom-right-radius: 2px;
        transform: translate(1px, -3px) rotate(45deg);
        content: '';
        [dir=rtl] & {
          transform: translate(1px, -3px) rotate(-45deg);
        }
      }
    }
    ${(props) => props.theme.breakpoints.down('sm')} {
      bottom: 32px;
      max-width: 170px;
      [dir=rtl] & {
        left: 50%;
      }
    }
  }
  &.bottom {
    right: 16px;
    transform-origin: right top;
    .arrow {
      z-index: -1;
      top: -7.5px;
      right: 19px;
      width: 8px;
      height: 8px;
      &::after {
        width: 6px;
        height: 6px;
        position: absolute;
        background: #a0fe93;
        border-top-left-radius: 2px;
        transform: translate(1px, 5px) rotate(45deg);
        content: '';
        [dir=rtl] & {
          transform: translate(1px, 5px) rotate(-45deg);
        }
      }
    }
  }
  img {
    width: 12px;
    height: 12px;
    margin-left: 4px;
  }
  .bgWrapper {
    position: absolute;
    border-radius: 34px;
    height: 100%;
    left: 0;
    right: 0;
    overflow: hidden;
    @keyframes share-btn-tip-animate {
      0% {
        left: -44px;
      }
  
      100% {
        left: 100%;
      }
    }
    .bg {
      position: absolute;
      height: 100%;
      min-height: 25px;
      width: auto;
      left: -44px;
      animation: share-btn-tip-animate 2.2s cubic-bezier(0.16, 0.2, 0.93, 1.11) 0s infinite;
    }
  }
`;

export function InviteTip({ bannerInfo, position = 'right-top' }) {
  const { maxInviteBonusCoefficient } = bannerInfo || {};
  const { currentLang } = useLocale();
  if (!maxInviteBonusCoefficient) return null;
  return (
    <NoSSG>
      <InviteTipWrapper className={position}>
        <span>{_t('6b92aefa2a1b4800a06e', {
          max: numberFormat({
            number: maxInviteBonusCoefficient,
            lang: currentLang,
            options: {
              style: 'percent',
            },
          })
        })}</span>
        <img src={doubleArrowIcon} alt="double-arrow" />
        <div className="bgWrapper">
          <img src={shareTipBg} className="bg" alt="tip-bg" />
        </div>
        <span className='arrow' />
      </InviteTipWrapper>
    </NoSSG>
  );
}

function Banner() {
  const isInApp = JsBridge.isApp();
  const { sm } = useResponsive();
  const { message } = useSnackbar();
  const { currentLang } = useLocale();
  const dispatch = useDispatch();
  const onShare = useShare('/gempool');

  const isSm = !sm;

  const { pass: isUserInteraction }  = useRealInteraction();

  const bannerInfo = useSelector((state) => state.gempool.bannerInfo);
  const referralCode = useSelector((state) => state.user.referralCode);
  const currency = useSelector((state) => state.currency.currency); // 当前用户选择的法币单位
  const selected = CURRENCY_CHARS.filter((item) => item.currency === currency)[0]; // 对应金融符号
  const legalChars = selected ? `${selected.char}` : '';
  const prices = useSelector((state) => state.currency.prices); // 转换比例

  useEffect(() => {
    dispatch({
      type: 'gempool/pullGemPoolBanner@polling',
    });
    return () => {
      dispatch({
        type: 'gempool/pullGemPoolBanner@polling:cancel',
      });
    };
  }, [dispatch]);

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
      const rate = prices[BASE_CURRENCY]; // 转换比例
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

  const handleToRule = useCallback(() => {
    trackClick(['GempoolMainRule', '1']);
    locateToUrl(
      '/announcement/en-introducing-kucoin-gempool-lock-to-earn-free-gem-tokens-on-kucoin',
    );
  }, []);

  const handleShare = useCallback(
    debounce(
      () => {
        onShare();
        trackClick(['GempoolMainShare', '1']);
      },
      1000,
      { trailing: false, leading: true },
    ),
    [onShare],
  );

  const handleLocateTo = useCallback(() => {
    trackClick(['Main', 'gempoolHistoricalReturns']);
    locateToUrlInApp('/gempool/historical-earnings');
  }, []);

  const extraComp = useMemo(() => {
    return (
      <ExtraWrapper>
        <ICNoviceGuideOutlined onClick={handleToRule} />
        <ShareIcon onClick={handleShare} />
      </ExtraWrapper>
    );
  }, [handleShare, handleToRule]);

  return (
    // banner 固定黑色
    <ThemeProvider theme="dark">
      <StyledBanner data-inspector="inspector_gempool_banner" isInApp={isInApp}>
        <StyledBannerBg isSm={isSm} isInApp={isInApp} />
        <NoSSG>
          <Header
            title={_t('3f14d758f7b84000a527')}
            titleInitTransparent={true}
            extra={extraComp}
            tip={!isUserInteraction && (
              <InviteTip position='bottom' bannerInfo={bannerInfo} />
            )}
          />
        </NoSSG>

        <div className="container">
          <div className="left">
            <h1 className="main-title">{_t('3f14d758f7b84000a527')}</h1>
            <h2 className="sub-title">{_t('6d3e6cef03e34000af4c')}</h2>
            <TradeInfo>
              <div className="number-info">
                <div className="number-title amountClassName">
                  {!isNil(bannerInfo?.stakingProductAmounts) ? (
                    <CountUp
                      amountClassName="amountClassName"
                      start={0}
                      decimals={0}
                      end={bannerInfo?.stakingProductAmounts || 0}
                      duration="4"
                      formattingFn={formattingPrice}
                    />
                  ) : (
                    '--'
                  )}
                </div>
                <div className="number-des">{_t('5c73573bf3b54000a745')}</div>
              </div>
              <div className="number-info second-info">
                <div className="number-title amountClassName">
                  {!isNil(bannerInfo?.stakingProductParticipants) ? (
                    <CountUp
                      start={0}
                      end={bannerInfo?.stakingProductParticipants || 0}
                      duration="4"
                      prefix=""
                      suffix=""
                      formattingFn={formattingFn}
                    />
                  ) : (
                    '--'
                  )}
                </div>
                <div className="number-des">{_t('64f2420742224000a62d')}</div>
              </div>
            </TradeInfo>
            {!isInApp ? (
              <BtnGroup>
                <Button type="default" size={isSm ? 'mini' : 'basic'} onClick={handleToRule}>
                  <ICNoviceGuideOutlined />
                  {_t('d7087116f7c94000a4af')}
                </Button>
                <CopyToClipboard
                  text={`${window.location.href}${referralCode ? `?rcode=${referralCode}` : ''}`}
                  onCopy={() => {
                    trackClick(['GempoolMainShare', '1']);
                    message.success(_t('afb1ecf83b964000a45c'));
                  }}
                >
                  <Button
                    className='shareBtn'
                    type="default"
                    size={isSm ? 'mini' : 'basic'}

                  >
                    <ICShareOutlined />
                    {_t('9a2aaaf92e8b4000a6af')}
                    {
                      !isUserInteraction && <InviteTip bannerInfo={bannerInfo} />
                    }
                  </Button>
                </CopyToClipboard>
              </BtnGroup>
            ) : null}
            {isSm && (
              <LinkWrapper
                to={'/gempool/historical-earnings'}
                onClick={handleLocateTo}
                dontGoWithHref={isInApp}
              >
                {_t('4f35196032954000a1a9')}
                <ICArrowRightOutlined size="16" />
              </LinkWrapper>
            )}
          </div>

          {!isSm && (
            <div className="right">
              <AnimateElement
                className="gempool_icon"
                load={() => import('static/lottie/gempool_mining.json')}
                loop={true}
              />
            </div>
          )}
        </div>
      </StyledBanner>
    </ThemeProvider>
  );
}

export default memo(Banner);
