/**
 * Owner: jessie@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useLocale } from '@kucoin-base/i18n';
import { Breadcrumb, NumberFormat, styled, useResponsive } from '@kux/mui';
import { Link } from 'components/Router';
import get from 'lodash/get';
import { memo, useCallback } from 'react';
import { shallowEqual } from 'react-redux';
import NoSSG from 'src/components/NoSSG';
import { useSelector } from 'src/hooks/useSelector';
import siteCfg from 'src/utils/siteConfig';
import faq from 'static/spotlight6/faq.svg';
import rule from 'static/spotlight6/rule.svg';
import stone from 'static/spotlight6/stone.svg';
import { _t } from 'tools/i18n';
import { locateToUrlInApp } from 'TradeActivity/utils';
import AppHeader from 'TradeActivityCommon/AppHeader';

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
  &.isPC {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    width: 100%;
    height: calc(100% + 250px);
    background: ${(props) => `url(${props.bannerUrl})`};
    background-repeat: no-repeat;
    background-position-x: center;
    background-position-y: bottom;
    background-size: cover;
    [dir='rtl'] & {
      transform: rotateY(180deg);
      will-change: transform;
    }

    ${(props) => props.theme.breakpoints.down('lg')} {
      height: 100%;
      background-position-y: top;
      background-size: contain;
    }
  }

  &.isH5 {
    position: absolute;
    top: 0;
    left: 50%;
    z-index: 0;
    width: 100%;
    height: 100%;
    background: ${(props) => `url(${props.bannerUrl})`};
    background-repeat: no-repeat;
    background-position-x: right;
    background-position-y: top;
    background-size: 50%;
    border-radius: 16px;
    transform: translateX(-50%);
    filter: blur(80px);
    content: '';
    will-change: filter;
  }
`;

const Wrapper = styled.div`
  width: 1200px;
  margin: 0 auto;
  padding: 40px 0 60px;

  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 100%;
    padding: 40px 24px 60px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 100%;
    padding: 0px 16px 16px;
  }
`;

const BreadcrumbWrapper = styled(Breadcrumb)`
  padding-top: 20px;
  font-size: 12px;
  line-height: 20px;

  a {
    color: ${(props) => props.theme.colors.text60};

    &:hover {
      color: ${(props) => props.theme.colors.text};
    }
  }
  .Item-Child:hover {
    border-bottom: none;
  }
`;

const Content = styled.div`
  margin-top: 70px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: ${(props) => (props.isInApp ? 0 : '55px')};
  }
`;

const CurrencyInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 54px;

  ${(props) => props.theme.breakpoints.down('sm')} {
    flex-direction: column;
    margin-bottom: 26px;
    text-align: center;
  }
`;

const CurrencyIcon = styled.div`
  width: 94px;
  height: 94px;
  margin-right: 30px;

  img {
    width: 100%;
    height: 100%;
    border-radius: 100%;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 80px;
    height: 80px;
    margin-right: 0;
    margin-bottom: 16px;
  }
`;

const CurrencyDesc = styled.div`
  flex: 1;
`;

const CurrencyDescTitle = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  color: #01bc8d;

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 12px;
    line-height: 16px;
  }
`;

const CurrencyDescName = styled.div`
  display: flex;
  align-items: flex-end;
  color: #ffffff;
  font-weight: 600;
  font-size: 36px;
  line-height: 36px;
  margin: 6px 0 14px;
  > span {
    display: inline-block;
    margin-left: 8px;
    color: rgba(225, 232, 245, 0.4);
    font-weight: 400;
    font-size: 18px;
    line-height: 23px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    flex-direction: column;
    align-items: center;
    margin: -2px 0 12px;
    font-size: 28px;
    text-align: center;
    > span {
      display: block;
      margin-left: 0;
      font-size: 14px;
      line-height: 18px;
    }
  }
`;

const CurrencyDescItems = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: rgba(225, 232, 245, 0.68);
  gap: 4px;

  ${(props) => props.theme.breakpoints.down('sm')} {
    justify-content: center;
  }
`;

const CurrencyDescItem = styled(Link)`
  display: flex;
  align-items: center;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: rgba(225, 232, 245, 0.68) !important;
  padding: 4px 8px;
  background: rgba(225, 232, 245, 0.08);
  border-radius: 4px;

  img {
    width: 10px;
    height: 10px;
    margin-right: 4px;
  }
`;

const CurrencyToken = styled.div`
  display: flex;
  align-items: flex-start;

  ${(props) => props.theme.breakpoints.down('sm')} {
    flex-wrap: wrap;
  }
`;

const Item = styled.div`
  margin-right: 76px;

  &:last-of-type {
    margin-right: 0;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    min-width: 40%;
    margin-right: 30px;
    margin-bottom: 20px;
  }
`;

const ItemTitle = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 8px;

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 12px;
    line-height: 16px;
  }
`;

const ItemContent = styled.div`
  font-weight: 600;
  font-size: 24px;
  line-height: 31px;
  color: rgba(255, 255, 255, 1);
  align-items: center;
  display: inline-flex;
  span {
    margin-right: 4px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 20px;
    line-height: 26px;
  }
`;

const Banner = () => {
  const { currentLang } = useLocale();
  const { sm } = useResponsive();
  const isInApp = JsBridge.isApp();

  const {
    baseCurrencyName: currencyFullName,
    baseCurrency: currencyShortName,
    baseCurrencyIcon: currencyIcon,
    currencyDesc,
    price,
    quoteCurrency,
    campaignAmount,
    minUnitSize,
    maxUnitSize,
    descriptionModule,
    mediaModule = [],
    releaseSchedule = [],
    faqModule = [],
    bannerUrl,
  } = useSelector((state) => state.spotlight.detailInfo, shallowEqual);
  const pageData = useSelector((state) => state.spotlight.pageData, shallowEqual);

  const link = get(pageData, 'activity[0].exchange_report_link');

  const renderFormattedNumber = useCallback(
    (num) => {
      return <NumberFormat lang={currentLang}>{num}</NumberFormat>;
    },
    [currentLang],
  );

  return (
    <Container>
      <BgWrapper className={!sm ? 'isH5' : 'isPC'} bannerUrl={sm ? bannerUrl : currencyIcon} />
      <div className="content">
        <NoSSG>
          <AppHeader theme="dark" bgColor="#181e29" />
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
                <CurrencyDescTitle>
                  {window._BRAND_NAME_} {_t('vTWw5ibiqesJDwEfga6g1g')}
                </CurrencyDescTitle>
                <CurrencyDescName>
                  {currencyFullName || ''}({currencyShortName || ''})
                  <span>{currencyDesc || ''}</span>
                </CurrencyDescName>
                <CurrencyDescItems>
                  {!(mediaModule && mediaModule.length) &&
                  !descriptionModule &&
                  !(releaseSchedule && releaseSchedule.length) ? null : (
                    <CurrencyDescItem to="#projectInfo">
                      <img alt="stone" src={stone} />
                      {_t('wh96h6VC3WRWu8PX4xyenC')}
                    </CurrencyDescItem>
                  )}
                  {!link ? null : (
                    <CurrencyDescItem
                      to={link}
                      onClick={() => locateToUrlInApp(link)}
                      dontGoWithHref={isInApp}
                    >
                      <img alt="rule" src={rule} />
                      {_t('fD8XnyfH6YnVg7Gg45qW6u')}
                    </CurrencyDescItem>
                  )}
                  {!faqModule?.length ? null : (
                    <CurrencyDescItem to="#faq">
                      <img alt="faq" src={faq} />
                      {_t('newhomepage.faq')}
                    </CurrencyDescItem>
                  )}
                </CurrencyDescItems>
              </CurrencyDesc>
            </CurrencyInfo>
            <CurrencyToken>
              <Item>
                <ItemTitle>{_t('iEUetvsL4xWc3nHK7n6TGd')}</ItemTitle>
                <ItemContent>
                  {renderFormattedNumber(price)}
                  {` ${quoteCurrency || ''}`}
                </ItemContent>
              </Item>
              <Item>
                <ItemTitle>{_t('vG2iucgVwjXGucQuT15f73')}</ItemTitle>
                <ItemContent>{renderFormattedNumber(campaignAmount)}</ItemContent>
              </Item>
              <Item>
                <ItemTitle>{_t('jfNpWRh9GNHncfFTYdfzUA')}</ItemTitle>
                <ItemContent>
                  {minUnitSize !== maxUnitSize ? (
                    <>
                      <span>
                        {renderFormattedNumber(minUnitSize) || ''}
                        {` ${currencyShortName || ''}`}
                      </span>
                      <span>~</span>
                      <span>
                        {renderFormattedNumber(maxUnitSize) || ''}
                        {` ${currencyShortName || ''}`}
                      </span>
                    </>
                  ) : (
                    <>
                      {renderFormattedNumber(minUnitSize) || ''} {currencyShortName || ''}
                    </>
                  )}
                </ItemContent>
              </Item>
            </CurrencyToken>
          </Content>
        </Wrapper>
      </div>
    </Container>
  );
};

export default memo(Banner);
