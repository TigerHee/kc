/**
 * Owner: jessie@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useLocale } from '@kucoin-base/i18n';
import { ICHistoryOutlined } from '@kux/icons';
import { Breadcrumb, NumberFormat, numberFormat, styled, useResponsive, useSnackbar } from '@kux/mui';
import { Link } from 'components/Router';
import get from 'lodash/get';
import { memo, useEffect, useMemo } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import LottieProvider from 'src/components/LottieProvider';
import NoSSG from 'src/components/NoSSG';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'tools/i18n';
import { locateToUrlInApp } from 'TradeActivity/utils';
import AppHeader from 'TradeActivityCommon/AppHeader';
import { push } from 'utils/router';
import { BubbleTip } from './components/BubbleTip';

import bannerIconMaskSvg from 'static/spotlight8/banner-currency-mask.svg';
import bannerBgDot from 'static/spotlight8/banner-dot.png';
import bannerBgLeft from 'static/spotlight8/banner-left.png';
import bannerBgRight from 'static/spotlight8/banner-right.jpg';
import approveSvg from 'static/spotlight8/ic2_approve.svg';
import documentSvg from 'static/spotlight8/ic2_documents.svg';
import noviceGuideSvg from 'static/spotlight8/ic2_novice_guide.svg';
import questionSvg from 'static/spotlight8/ic2_question.svg';
import sBorderModifier from 'static/spotlight8/square-border-modifier.svg';
import tBorderModifier from 'static/spotlight8/t-border-modifier.svg';
import sparklesBg from 'static/spotlight8/sparkles.svg';
import { EVENT_STATUS } from './constants';
import CopyToClipboard from 'react-copy-to-clipboard';
import { getShareLink } from 'src/utils/getUtm';
import shareSvg from 'static/spotlight7/ic2_share.svg';

const Container = styled.div`
  width: 100%;
  position: relative;
  background-color: #121212;
  background-image: url(${bannerBgLeft}), url(${bannerBgRight}),  url(${bannerBgDot});
  background-repeat: no-repeat;
  /* @noflip */
  background-position: left bottom, right top, center;
  background-size: 50%, 40%, 100%;

  .content {
    position: relative;
    z-index: 4;
  }
`;

const Wrapper = styled.div`
  width: 1200px;
  margin: 0 auto;
  padding: 0;
  background: url(${sparklesBg}) no-repeat top center;

  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 100%;
    padding: 0 24px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 100%;
    padding: 0 16px;
    background-size: 160px 160px;
  }
`;

const BreadcrumbWrapper = styled(Breadcrumb)`
  padding: 26px 0 12px;
  font-size: 14px;
  line-height: 18px;

  a {
    color: rgba(243, 243, 243, 0.6);
    font-weight: 400;
    &:hover {
      color: #f3f3f3;
    }
  }
  .KuxDivider-center {
    background: rgba(243, 243, 243, 0.6);
  }
  .Item-Child:hover {
    border-bottom: none;
  }

  .current-bread {
    color: #f3f3f3 !important;
    font-weight: 400;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 12px;
    line-height: 16px;
  }
`;

const Content = styled.div`
  margin-top: 16px;
  position: relative;
  ${(props) => props.theme.breakpoints.down('lg')} {
    margin-top: 64px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: ${(props) => (props.isInApp ? 0 : '16px')};
  }
`;

const CurrencyInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 54px;

  ${(props) => props.theme.breakpoints.down('lg')} {
    margin-bottom: 35px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-bottom: 21px;
  }
`;

const CurrencyIcon = styled.div`
  width: 160px;
  height: 160px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url(${bannerIconMaskSvg}) no-repeat;
  background-size: 100% 100%;

  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 120px;
    height: 120px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 100px;
    height: 100px;
  }

  .currency-icon {
    position: relative;
    width: 80px;
    height: 80px;

    ${(props) => props.theme.breakpoints.down('lg')} {
      width: 60px;
      height: 60px;
    }
    ${(props) => props.theme.breakpoints.down('sm')} {
      width: 50px;
      height: 50px;
    }
  }

  .bg-animate {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  img {
    width: 100%;
    height: 100%;
    border-radius: 100%;
  }
`;

const EventStatus = styled.div`
  display: flex;
  padding: 2px 4px;
  border-radius: 4px;
  background: rgba(0, 194, 136, 0.08);
  color: #00c288;
  font-size: 14px;
  font-weight: 500;
  position: absolute;
  bottom: -8px;

  &.waiting {
    color: #f8b200;
    background: rgba(248, 178, 0, 0.08);
  }

  &.ended {
    color: rgba(243, 243, 243, 0.4);
    background: rgba(243, 243, 243, 0.08);
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 12px;
    bottom: 4px;
  }
`;

const CurrencyDesc = styled.div`
  flex: 1;
  margin-top: 40px;

  ${(props) => props.theme.breakpoints.down('lg')} {
    margin-top: 24px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 8px;
  }
`;

const CurrencyDescName = styled.div`
  color: #f3f3f3;
  font-size: 28px;
  font-style: normal;
  font-weight: 700;
  line-height: 130%;
  margin-bottom: 12px;
  text-align: center;

  ${(props) => props.theme.breakpoints.down('lg')} {
    font-size: 24px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 20px;
  }
`;

const CurrencyDescItems = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 130%;
  color: #f3f3f3;
  gap: 10px;

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 12px;
  }
`;
const ShareWrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  color: rgba(243, 243, 243, 0.6) !important;
  padding: 5px 8px;
  border-radius: 80px;
  border: 1px solid rgba(243, 243, 243, 0.08);
  background: rgba(243, 243, 243, 0.04);
  img {
    width: 16px;
    height: 16px;
    margin-right: 4px;
    [dir='rtl'] & {
      transform: rotateY(180deg);
    }
  }
`;
const CurrencyDescItem = styled(Link)`
  display: flex;
  align-items: center;
  color: rgba(243, 243, 243, 0.6) !important;
  padding: 5px 8px;
  border-radius: 80px;
  border: 1px solid rgba(243, 243, 243, 0.08);
  background: rgba(243, 243, 243, 0.04);
  img {
    width: 16px;
    height: 16px;
    margin-right: 4px;
    [dir='rtl'] & {
      transform: rotateY(180deg);
    }
  }
`;

const FundraisingTarget = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  padding: 18px 0;
  margin: 0 40px;
  position: relative;
  border-top: 1px solid rgba(243, 243, 243, 0.4);
  background: linear-gradient(180deg, rgba(243, 243, 243, 0.08) 7.5%, rgba(243, 243, 243, 0) 100%);

  &::before {
    position: absolute;
    top: -1px;
    /* @noflip */
    left: -40px;
    width: 40px;
    height: 100%;

    background: url(${tBorderModifier}) no-repeat;
    background-position: top center;
    background-size: 100%;
    content: '';
  }

  &::after {
    position: absolute;
    top: -1px;
    /* @noflip */
    right: -40px;
    width: 40px;
    height: 100%;
    background: url(${tBorderModifier}) no-repeat;
    background-position: top center;
    background-size: 100%;
    transform: rotateY(-180deg);
    content: '';
  }

  ${(props) => props.theme.breakpoints.down('lg')} {
    gap: 16px;
    margin: 0 20px;
    padding: 21px 0;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    flex-direction: column;
    gap: 8px;
    margin: 0 12px;
    padding: 12px 0;
    border-color: rgba(243, 243, 243, 0.46);
    border-style: solid;
    border-width: 1px 0 0 0;
    border-radius: 0;

    &::before {
      position: absolute;
      /* @noflip */
      left: -12px;
      width: 12px;
      height: 100%;
      background: url(${sBorderModifier}) no-repeat;
      content: '';
    }
    &::after {
      position: absolute;
      /* @noflip */
      right: -12px;
      width: 12px;
      height: 100%;
      background: url(${sBorderModifier}) no-repeat;
      content: '';
    }
  }
`;

const TargetItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  color: ${(props) => props.theme.colors.text};

  .title {
    margin-bottom: 4px;
    color: rgba(243, 243, 243, 0.6);
    font-weight: 400;
    font-size: 14px;
    text-align: center;
    position: relative;

    .price-tip {
      position: absolute;
      bottom: 100%;
      left: 70%;
      width: max-content;
    }
  }
  .value {
    position: relative;
    color: #f3f3f3;
    font-weight: 500;
    font-size: 16px;

    .price-tip {
      margin-top: 8px;
      border-radius: 3px;
      display: inline-block;
    }
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    flex-direction: row;
    gap: 10px;

    gap: 8px;
    width: 100%;
    .title {
      flex: 1;
      font-size: 12px;
      text-align: start;
    }
    .value {
      flex: 1;
      font-size: 14px;
      text-align: end;
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

// banner 状态对应的 key
const STATUS_KEY_MAP = {
  // 已结束
  [EVENT_STATUS.ENDED]: '56973c1c54404000aca6',
  // 进行中
  [EVENT_STATUS.IN_PROGRESS]: '717a75c1153d4000a455',
  // 分发中
  [EVENT_STATUS.DISTRIBUTING]: '5a1e831aeeb64000a8e3',
  // 未开始(预热)
  [EVENT_STATUS.NOT_START]: 'f0181423321c4000abfd',
};

const Banner = () => {
  const { message } = useSnackbar();
  const { currentLang } = useLocale();
  const { sm } = useResponsive();
  const dispatch = useDispatch();
  const isInApp = JsBridge.isApp();

  const {
    token: tokenCode,
    // 总发售总量
    totalSaleQuantity,
    tokenName: currencyFullName,
    tokenIcon: currencyIcon,
    fundraisingAmount,
    userMaxInvestmentQuantity,
    currencyList,
    kcsPrices,
    // 活动简介
    descriptionModule,
    tokenPrice,
    faqModule = [],
  } = useSelector((state) => state.spotlight8.detailInfo, shallowEqual);
  const eventStatus = useSelector((state) => state.spotlight8.eventStatus);
  const pageData = useSelector((state) => state.spotlight8.pageData, shallowEqual);
  const referralCode = useSelector((state) => state.user.referralCode);
  const { isLogin } = useSelector((state) => state.user);
  const link = get(pageData, 'activity[0].exchange_report_link');
  const pageId = get(pageData, 'id');

  useEffect(() => {
    dispatch({
      type: 'spotlight8/getActivitySubcribeCount@polling',
    });
    return () => {
      dispatch({
        type: 'spotlight8/getActivitySubcribeCount@polling:cancel',
      });
    };
  }, [dispatch]);

  const extraComp = useMemo(() => {
    return (
      <ExtraWrapper>
        <ICHistoryOutlined
          onClick={() => push(`/spotlight_r8/purchase-record/${pageId}_${currencyFullName}`)}
        />
      </ExtraWrapper>
    );
  }, [currencyFullName, pageId]);

  // 查找第折扣最大的币种
  const discountCurrency = useMemo(() => {
    if (!currencyList) return null;
    // KCS 最大折扣
    const kcsMax = kcsPrices && kcsPrices.length > 0 ? kcsPrices[kcsPrices.length - 1]?.discountRate : null;
    // 过滤出折扣大于0的币种
    const discCurrency = currencyList
      .filter((item) => Number(item.discountRate) > 0)
      .reduce(
        (prev, current) => (prev && prev.discountRate > current.discountRate ? prev : current),
        null,
      );
    // 如果kcsMax不存在，直接返回折扣最大的币种
    if (!Number(kcsMax)) return discCurrency;
    // 没有折扣币种, 或折扣最大的币种是KCS，或者 kcs 的最大折扣大于等于折扣最大的币种，返回KCS
    if (!discCurrency || discCurrency.currency ==='KCS' || Number(kcsMax) >= Number(discCurrency.discountRate)) {
      return {
        currency: 'KCS',
        discountRate: kcsMax,
      };
    } else {
      return discCurrency;
    }
  }, [currencyList, kcsPrices]);


  const bannerStatus =
    eventStatus === EVENT_STATUS.ENDED
      ? 'ended'
      : eventStatus === EVENT_STATUS.NOT_START
      ? 'waiting'
      : 'inProgress';

  return (
    <Container>
      <div className="content">
        <NoSSG>
          <AppHeader theme="dark" extra={extraComp} />
        </NoSSG>

        <Wrapper>
          {isInApp ? null : (
            <BreadcrumbWrapper>
              <Breadcrumb.Item>
                <Link to="/">{_t('home')}</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to="/spotlight-center">{_t('vTWw5ibiqesJDwEfga6g1g')}</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item className="current-bread">{currencyFullName}</Breadcrumb.Item>
            </BreadcrumbWrapper>
          )}

          <Content isInApp={isInApp}>
            <CurrencyInfo>
              <CurrencyIcon>
                <div className="currency-icon">
                  <img src={currencyIcon} alt="logo" />
                  <LottieProvider iconName="spotlight_light" className={'bg-animate'} />
                </div>
                <EventStatus className={bannerStatus}>{_t(STATUS_KEY_MAP[eventStatus])}</EventStatus>
              </CurrencyIcon>
              <CurrencyDesc>
                <CurrencyDescName>
                  {currencyFullName || ''} ({tokenCode})
                </CurrencyDescName>
                <CurrencyDescItems>
                  {/* 无项目简介则隐藏锚点 */}
                  {descriptionModule ? (
                    <CurrencyDescItem to="#projectInfo">
                      <img alt="projectInfo" src={noviceGuideSvg} />
                      {_t('wh96h6VC3WRWu8PX4xyenC')}
                    </CurrencyDescItem>
                  ) : null}
                  {!link ? null : (
                    <CurrencyDescItem
                      to={link}
                      onClick={() => locateToUrlInApp(link)}
                      dontGoWithHref={isInApp}
                    >
                      <img alt="rule" src={documentSvg} />
                      {_t('fD8XnyfH6YnVg7Gg45qW6u')}
                    </CurrencyDescItem>
                  )}
                  {!faqModule?.length ? null : (
                    <CurrencyDescItem to="#faq">
                      <img alt="faq" src={questionSvg} />
                      {_t('newhomepage.faq')}
                    </CurrencyDescItem>
                  )}
                  <CurrencyDescItem to="#requirements">
                    <img alt="requirements" src={approveSvg} />
                    {_t('dd3d5NmJhJxHRaDahoB6bx')}
                  </CurrencyDescItem>
                  <CopyToClipboard
                    text={getShareLink(isLogin? { rcode: referralCode } : null)}
                    onCopy={() => {
                      message.success(_t('afb1ecf83b964000a45c'));
                    }}
                  >
                    <ShareWrapper>
                      <img alt="share_icon" src={shareSvg} />
                      {_t('5d420a2591a54000ae9f')}
                    </ShareWrapper>
                  </CopyToClipboard>
                </CurrencyDescItems>
              </CurrencyDesc>
            </CurrencyInfo>

            <FundraisingTarget>
              <TargetItem>
                {/* 代币发售总量 */}
                <div className="title">{_t('dc2fce21c3464000a9d3')}</div>
                <div className="value">
                  {!totalSaleQuantity ? (
                    '--'
                  ) : (
                    <>
                      <NumberFormat lang={currentLang}>{totalSaleQuantity}</NumberFormat>{' '}
                      {tokenCode}
                    </>
                  )}
                </div>
              </TargetItem>
              <TargetItem>
                {/* 募资总目标 */}
                <div className="title">{_t('ddf6955e11224000a56e')}</div>
                <div className="value">
                  {!fundraisingAmount ? (
                    '--'
                  ) : (
                    <>
                      <NumberFormat lang={currentLang}>{fundraisingAmount}</NumberFormat> USDT
                    </>
                  )}
                </div>
              </TargetItem>
              <TargetItem>
                {/* 发售单价 */}
                <div className="title">
                  <span>
                    {_t('e7b1aad0e6814000a687')}
                  </span>
                  {/* 有折扣价 */}
                  {discountCurrency && tokenPrice && sm && (
                    <BubbleTip
                      arrowPlacement='bottom-left'
                      className="price-tip"
                    >
                      {/* kcs 使用: KCS 享最高xxx 折扣, 其他: xxx 享 xx% 折扣 */}
                      {_t(discountCurrency.currency === 'KCS' ? '178f4b99f5ca4800a60c' : '9fb740e93ef94000a019', {
                        currencyName: discountCurrency.currency,
                        discount: numberFormat({
                          number: discountCurrency.discountRate / 100,
                          lang: currentLang,
                          options: {
                            style: 'percent',
                          },
                        }),
                      })}
                    </BubbleTip>
                  )}
                </div>
                <div className="value sale-price">
                  <span>
                    {!tokenPrice ? (
                      '--'
                    ) : (
                      <NumberFormat lang={currentLang}>{tokenPrice}</NumberFormat>
                    )}
                  </span>
                  {/* 有折扣价 */}
                  {discountCurrency && tokenPrice && !sm && (
                    <div className='price-tip-wrapper'>
                      <BubbleTip
                        arrowPlacement={'top-right'}
                        className="price-tip"
                      >
                        {/* kcs 使用: KCS 享最高xxx 折扣, 其他: xxx 享 xx% 折扣 */}
                        {_t(discountCurrency.currency === 'KCS' ? '178f4b99f5ca4800a60c' : '9fb740e93ef94000a019', {
                          currencyName: discountCurrency.currency,
                          discount: numberFormat({
                            number: discountCurrency.discountRate / 100,
                            lang: currentLang,
                            options: {
                              style: 'percent',
                            },
                          }),
                        })}
                      </BubbleTip>
                    </div>
                  )}
                </div>
              </TargetItem>
              <TargetItem>
                {/* Hard Cap per User */}
                <div className="title">{_t('jfNpWRh9GNHncfFTYdfzUA')}</div>
                <div className="value">
                  {!userMaxInvestmentQuantity ? (
                    '--'
                  ) : (
                    <>
                      <NumberFormat lang={currentLang}>{userMaxInvestmentQuantity}</NumberFormat>{' '}
                      {tokenCode}
                    </>
                  )}
                </div>
              </TargetItem>
            </FundraisingTarget>
          </Content>
        </Wrapper>
      </div>
    </Container>
  );
};

export default memo(Banner);
