/**
 * Owner: jessie@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useLocale } from '@kucoin-base/i18n';
import { ICArrowRight2Outlined, ICHistoryOutlined } from '@kux/icons';
import { Breadcrumb, Divider, NumberFormat, styled, useResponsive, useSnackbar } from '@kux/mui';
import { Link } from 'components/Router';
import get from 'lodash/get';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import NoSSG from 'src/components/NoSSG';
import { useSelector } from 'src/hooks/useSelector';
import { ReactComponent as BenefitsIcon } from 'static/spotlight7/benefits.svg';
import approveSvg from 'static/spotlight7/ic2_approve.svg';
import documentSvg from 'static/spotlight7/ic2_documents.svg';
import noviceGuideSvg from 'static/spotlight7/ic2_novice_guide.svg';
import questionSvg from 'static/spotlight7/ic2_question.svg';
import shareSvg from 'static/spotlight7/ic2_share.svg';
import CopyToClipboard from 'react-copy-to-clipboard';
import { getShareLink } from 'src/utils/getUtm';
import siteCfg from 'src/utils/siteConfig';

import { _t } from 'tools/i18n';
import { locateToTrade, locateToUrlInApp } from 'TradeActivity/utils';
import AppHeader from 'TradeActivityCommon/AppHeader';
import { push } from 'utils/router';
import clsx from 'clsx';
import isNil from 'lodash/isNil';
const { KUCOIN_HOST } = siteCfg;

const Container = styled.div`
  width: 100%;
  position: relative;

  .content {
    position: relative;
    z-index: 4;
  }
`;

const BgWrapper = styled.div`
  position: absolute;
  display: flex;
  top: 0;
  left: 0;
  z-index: 0;
  width: 100%;
  height: 640px;
  overflow-x: hidden;
`;

const LeftBgWrapper = styled.div`
  flex: 1;
  width: 800px;
  height: 640px;
  position: relative;
  background: ${(props) => `url(${props.bg})`};
  background-position-x: left;
  background-position-y: top;
  background-size: cover;
  opacity: 0.3;

  &:before {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      180deg,
      #121212 0%,
      rgba(18, 18, 18, 0.1) 5%,
      rgba(18, 18, 18, 0.5) 80%,
      #121212 100%
    );
    content: '';
  }

  &:after {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100%;
    height: 100%;
    background: linear-gradient(305deg, #121212 24.35%, rgba(18, 18, 18, 0) 100%);
    content: '';
    [dir='rtl'] & {
      background: linear-gradient(-305deg, #121212 64.35%, rgba(18, 18, 18, 0) 100%);
    }
  }

  ${(props) => props.theme.breakpoints.down('lg')} {
    position: absolute;
    top: 0;
    left: 0;
    width: 560px;
    height: 448px;
    [dir='rtl'] & {
      left: -294px;
    }

    &:after {
      [dir='rtl'] & {
        background: linear-gradient(-305deg, #121212 100%, rgba(18, 18, 18, 0) 20%);
      }
    }
  }
`;

const CustomBgWrapper = styled.div`
  width: 880px;
  height: 528px;
  flex: 1;
  position: relative;
  z-index: 1;
  background: ${(props) => `url(${props.bg})`};
  background-position-x: left;
  background-position-y: top;
  background-repeat: no-repeat;
  background-size: contain;

  [dir='rtl'] & {
    transform: rotateY(180deg);
  }

  ${(props) => props.theme.breakpoints.down('lg')} {
    position: absolute;
    top: 0;
    right: -154px;
    width: 560px;
    height: 356px;
  }
`;

const H5BgWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  width: 100%;
  height: 480px;
  background: ${({ bg }) => `url(${bg})`};
  background-repeat: no-repeat;
  background-position-x: right;
  background-position-y: top;
  background-size: cover;
  [dir='rtl'] & {
    transform: rotateY(180deg);
  }
`;

const Wrapper = styled.div`
  width: 1200px;
  margin: 0 auto;
  padding: 0 0 80px;

  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 100%;
    padding: 0 24px 64px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 100%;
    padding: 16px 16px 12px;
  }
`;

const BreadcrumbWrapper = styled(Breadcrumb)`
  padding: 26px 0 12px;
  font-size: 14px;
  line-height: 18px;

  a {
    color: ${(props) => props.theme.colors.text60};

    &:hover {
      color: ${(props) => props.theme.colors.text};
    }
  }
  .Item-Child:hover {
    border-bottom: none;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 12px;
    line-height: 16px;
  }
`;

const Content = styled.div`
  margin-top: 80px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    margin-top: 64px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: ${(props) => (props.isInApp ? 0 : '16px')};
  }
`;

const CurrencyInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 32px;

  ${(props) => props.theme.breakpoints.down('lg')} {
    margin-bottom: 24px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-bottom: 6px;
  }
`;

const CurrencyIcon = styled.div`
  width: 120px;
  height: 120px;
  margin-right: 24px;

  img {
    width: 100%;
    height: 100%;
    border-radius: 100%;
  }

  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 100px;
    height: 100px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 64px;
    height: 64px;
    margin-right: 16px;
  }
`;

const CurrencyDesc = styled.div`
  flex: 1;
  .benefitsSm {
    color: #00C288;
    font-size: 13px;
    font-style: normal;
    font-weight: 500;
    line-height: 130%;
    text-decoration-line: underline;
    text-decoration-style: solid;
    text-decoration-skip-ink: none;
    text-decoration-thickness: auto;
    text-underline-offset: auto;
    text-underline-position: from-font;
    cursor: pointer;
  }
`;


const CurrencyDescName = styled.div`
  color: #f3f3f3;
  font-size: 40px;
  font-style: normal;
  font-weight: 700;
  line-height: 130%;
  text-align: left;

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 36px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-bottom: 0;
    font-size: 24px;
  }
`;

const CurrencyDescItems = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 130%;
  color: #f3f3f3;
  & a:not(:last-child) {
    margin-right: 10px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-bottom: 24px;
    font-size: 12px;
  }
`;
const ShareWrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.colors.text} !important;
  padding: 4px 8px;
  background: ${(props) => props.theme.colors.layer};
  border-radius: 4px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 10px;
  }

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
  color: ${(props) => props.theme.colors.text} !important;
  padding: 4px 8px;
  background: ${(props) => props.theme.colors.layer};
  border-radius: 4px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 10px;
  }

  img {
    width: 16px;
    height: 16px;
    margin-right: 4px;
    [dir='rtl'] & {
      transform: rotateY(180deg);
    }
  }
`;
const Benefits = styled.div`
  display: flex;
  padding: 7.5px 16px 7.5px 14px;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.colors.text};
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  border-radius: 24px;
  border: 1px solid  ${(props) => props.theme.colors.text} ;
  margin-left: 16px;
  cursor: pointer;
`;
const CurrencyToken = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 144px;

  .hr {
    height: 46px;
    margin: 0 40px;
  }

  ${(props) => props.theme.breakpoints.down('lg')} {
    padding-left: 124px;
    .hr {
      margin: 0 24px;
    }
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding-left: 0;
    .hr {
      height: 24px;
    }
  }
`;

const Item = styled.div``;

const ItemTitle = styled.div`
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text40};
  margin-top: 4px;

  ${(props) => props.theme.breakpoints.down('lg')} {
    font-size: 14px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 12px;
  }
`;

const ItemContent = styled.div`
  font-size: 28px;
  font-style: normal;
  font-weight: 700;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};

  ${(props) => props.theme.breakpoints.down('lg')} {
    font-size: 24px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 20px;
  }
`;

const PlaceholderText = styled.span`
  color: ${(props) => props.theme.colors.text40};
`;

const ButtonWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  height: 48px;
  position: relative;
  z-index: 2;
  cursor: pointer;

  .leftIcon {
    width: 20px;
    min-width: 20px;
    height: 100%;

    [dir='rtl'] & {
      transform: rotateY(180deg);
    }
  }

  .rightIcon {
    width: 7px;
    min-width: 7px;
    height: 100%;

    [dir='rtl'] & {
      transform: rotateY(180deg);
    }
  }

  .textWrapper {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    margin: 0 -1px;
    padding: 0 24px 0 12px;
    color: #1d1d1d;
    font-weight: 700;
    font-size: 16px;
    font-style: normal;
    line-height: 130%;
    background-color: #00c288;
    border: none;

    svg {
      width: 20px;
      min-width: 20px;
      height: 20px;
      margin-left: 4px;
      [dir='rtl'] & {
        transform: rotateY(180deg);
      }
    }
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    height: 40px;
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

const Banner = () => {
  const { message } = useSnackbar();
  const { currentLang } = useLocale();
  const { sm } = useResponsive();
  const dispatch = useDispatch();
  const isInApp = JsBridge.isApp();
  const [bgImg, setBgImg] = useState('');

  const {
    baseCurrencyName: currencyFullName,
    baseCurrencyIcon: currencyIcon,
    faqModule = [],
    bannerUrl,
  } = useSelector((state) => state.spotlight7.detailInfo, shallowEqual);
  const pageData = useSelector((state) => state.spotlight7.pageData, shallowEqual);
  const tradeSymbol = useSelector((state) => state.spotlight7.tradeSymbol, shallowEqual);
  const tabData = useSelector((state) => state.spotlight7.tabData, shallowEqual);
  const { subAmountTotal } = tabData;
  const activitySubcribeCount = useSelector(
    (state) => state.spotlight7.activitySubcribeCount,
    shallowEqual,
  );
  const referralCode = useSelector((state) => state.user.referralCode);
  const { isLogin } = useSelector((state) => state.user);

  const link = get(pageData, 'activity[0].exchange_report_link');
  const pageId = get(pageData, 'id');
  const tokePath = get(pageData, 'token_path');

  const bgImgPromise = useCallback(() => {
    if (!sm) {
      import('static/spotlight7/h5Bg.svg').then((m) => setBgImg(m.default));
      return;
    }
    import('static/spotlight7/webBgLeft.png').then((m) => setBgImg(m.default));
  }, [sm]);

  useEffect(() => {
    bgImgPromise();
  }, [bgImgPromise]);

  useEffect(() => {
    dispatch({
      type: 'spotlight7/getActivitySubcribeCount@polling',
    });
    return () => {
      dispatch({
        type: 'spotlight7/getActivitySubcribeCount@polling:cancel',
      });
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: 'spotlight7/getVaildSymbol',
      payload: {
        currency: currencyFullName,
      },
    });
  }, [dispatch, currencyFullName]);

  const goBenefits = () => {
    dispatch({ type: 'spotlight7/openExplainModal', payload: { type: 'Earnings' }});
  }

  const memuItems = useMemo(() => {
    return (
      <CurrencyDescItems>
        <CurrencyDescItem to="#projectInfo">
          <img alt="projectInfo" src={noviceGuideSvg} />
          {_t('wh96h6VC3WRWu8PX4xyenC')}
        </CurrencyDescItem>
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
    );
  }, [link, isInApp, faqModule]);

  const extraComp = useMemo(() => {
    return (
      <ExtraWrapper>
        <ICHistoryOutlined
          onClick={() => push(`/spotlight7/purchase-record/${tokePath?.trim() || pageId}`)}
        />
      </ExtraWrapper>
    );
  }, [currencyFullName, pageId, tokePath]);

  return (
    <Container data-inspector="inspector_spotlight7_banner">
      {!sm ? (
        <H5BgWrapper bg={bgImg} />
      ) : (
        <BgWrapper>
          <LeftBgWrapper bg={bgImg} />
          <CustomBgWrapper bg={bannerUrl} />
        </BgWrapper>
      )}
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
              <Breadcrumb.Item>{currencyFullName}</Breadcrumb.Item>
            </BreadcrumbWrapper>
          )}

          <Content isInApp={isInApp}>
            <CurrencyInfo>
              <CurrencyIcon>
                <img src={currencyIcon} alt="logo" />
              </CurrencyIcon>
              <CurrencyDesc>
                <div className={clsx('flex-center',  { 'mb-8': sm })}>
                  <CurrencyDescName>{currencyFullName || ''}</CurrencyDescName>
                  {/* 权益 */}
                  {sm && <Benefits onClick={goBenefits}>
                    <BenefitsIcon className="mr-4" />
                    {_t('25f58714999e4000a686')}
                  </Benefits>}
                </div>
                {!sm && <div className="benefitsSm" onClick={goBenefits}>
                  {_t('25f58714999e4000a686')}
                </div>}
                {sm && memuItems}
              </CurrencyDesc>
            </CurrencyInfo>
            {!sm && memuItems}
            <CurrencyToken>
              <Item>
                <ItemContent>
                  {!isNil(activitySubcribeCount)? (
                    <NumberFormat lang={currentLang}>{activitySubcribeCount}</NumberFormat>
                  ) : (
                    <PlaceholderText>--</PlaceholderText>
                  )}
                </ItemContent>
                <ItemTitle>{_t('f186dc21eb774000a410')}</ItemTitle>
              </Item>
              <Divider type="vertical" className="hr" />
              {/* 申购人数 总申购金额 */}
              <Item>
                <ItemContent>
                  {subAmountTotal? (
                    <NumberFormat lang={currentLang}>{subAmountTotal}</NumberFormat>
                  ) : (
                    <PlaceholderText>--</PlaceholderText>
                  )}
                </ItemContent>
                <ItemTitle>{`${_t('a487981ce8294000ab2e', { currency: 'USDT' })}`}</ItemTitle>
              </Item>
              {/* {tradeSymbol ? (
                <>
                  <Divider type="vertical" className="hr" />
                  <ButtonWrapper onClick={() => locateToTrade(tradeSymbol)}>
                    {sm ? (
                      <ButtonLeft className="leftIcon" />
                    ) : (
                      <ButtonH5Left className="leftIcon" />
                    )}
                    <div className="textWrapper">
                      {_t('trade')}
                      <ICArrowRight2Outlined />
                    </div>
                    {sm ? (
                      <ButtonRight className="rightIcon" />
                    ) : (
                      <ButtonH5Right className="rightIcon" />
                    )}
                  </ButtonWrapper>
                </>
              ) : null} */}
            </CurrencyToken>
          </Content>
        </Wrapper>
      </div>
    </Container>
  );
};

export default memo(Banner);
