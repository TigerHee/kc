/**
 * Owner: solar.xia@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useLocale } from '@kucoin-base/i18n';
import { ICArrowLeftOutlined, ICArrowRightOutlined } from '@kux/icons';
import {
  Box,
  Breadcrumb,
  Divider,
  Select,
  styled,
  Tab,
  Tabs,
  Tag,
  ThemeProvider,
  useResponsive,
} from '@kux/mui';
import { useTheme } from '@kux/mui/hooks';
import clns from 'classnames';
import { Link } from 'components/Router';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { shallowEqual } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { push, replace } from 'src/utils/router';
import { themeFontMD } from 'src/utils/themeSelector';
import FireIcon from 'static/rocket_zone/fire.gif';
import { _t } from 'tools/i18n';
import { locateToUrlInApp } from 'TradeActivity/utils';
import { useActivityStatus, useResponsiveSize } from '../hooks';
import {
  BreadcrumbWrapper,
  CoinTabsActions,
  CoinTabsBar,
  StyledAllProjectLink,
  StyledBanner,
  StyledBannerContainer,
  StyledCoinTabs,
  WrapperCoinTabs,
  WrapperCoinTabsContainer,
} from '../styledComponents';
import { deleteCoinQuery } from '../util';
import { Card } from './components';
import { MyOrderLink } from './components/MyOrderLink';

const CoinDisplayLabelMap = {
  HOT: 'Hot',
  NEW: 'New',
};

const StyledTag = styled(Tag)`
  ${themeFontMD};
  margin-inline-start: 2px;
  -webkit-text-stroke: initial;
`;

const CoinTabLabel = ({ displayLabel }) => {
  switch (displayLabel) {
    case CoinDisplayLabelMap.HOT:
      return <img src={FireIcon} alt="hot" width={20} height={20} />;
    case CoinDisplayLabelMap.NEW:
      return <StyledTag color="primary">{_t('09e3bc749d994000a222')}</StyledTag>;
    default:
      return false;
  }
};

const CoinTabs = forwardRef((_, ref) => {
  const rawDeliveryCurrencyList = useSelector(
    (state) => state.aptp.deliveryCurrencyList,
    shallowEqual,
  );
  const deliveryCurrencyList = useMemo(
    () => rawDeliveryCurrencyList?.filter((x) => !!x.ongoing) ?? [],
    [rawDeliveryCurrencyList],
  );
  const [selectIndex, setSelectIndex] = useState(0);
  const deliveryCurrency = useSelector((state) => state.aptp.deliveryCurrency);

  const isInApp = JsBridge.isApp();
  // const navigate = useNavigate();
  const outerRef = useRef();
  useImperativeHandle(ref, () => ({
    getRef() {
      return outerRef;
    },
  }));
  const { sm, lg } = useResponsive();
  const showCount = useMemo(() => {
    if (lg) return 6;
    if (sm) return 4;
    return Infinity;
  }, [sm, lg]);
  const excess = deliveryCurrencyList.slice(showCount);

  const changeCoinsById = useCallback(
    (id) => {
      const coinName = deliveryCurrencyList.find((item) => item.id === id).shortName;
      replace(deleteCoinQuery(`/pre-market/${coinName}`));
    },
    [deliveryCurrencyList],
  );

  // 只在页面进入时调用
  useEffect(() => {
    if (deliveryCurrencyList.length) {
      let tabIndex = 0,
        tabId = deliveryCurrencyList[0].id;
      if (deliveryCurrency) {
        for (let i = 0; i < deliveryCurrencyList.length; i++) {
          const { shortName, id } = deliveryCurrencyList[i];
          if (deliveryCurrency === shortName) {
            tabIndex = i;
            tabId = id;
          }
        }
      }
      if (tabIndex < showCount) {
        setSelectIndex(tabIndex);
      } else {
        setSelectIndex(showCount);
      }
    }
  }, [deliveryCurrencyList, showCount, deliveryCurrency]);
  const tabs = deliveryCurrencyList.slice(0, showCount);
  return (
    <StyledCoinTabs ref={outerRef} isInApp={isInApp}>
      <Tabs
        value={selectIndex}
        onChange={(_, index) => {
          setSelectIndex(index);
          if (index !== showCount) {
            const id = tabs[index].id;
            changeCoinsById(id);
          }
        }}
        size="xsmall"
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            label={
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                style={{
                  height: '20px',
                  lineHeight: '20px',
                }}
              >
                <a style={{ verticalAlign: 'middle' }} href={`/pre-market/${tab.shortName}`}>
                  {tab.shortName}
                </a>
                <CoinTabLabel displayLabel={tab.displayLabel} />
              </Box>
            }
          />
        ))}
        {Boolean(excess.length) && (
          <Tab
            label={
              <Select
                size="mini"
                noStyle
                className={clns({ actived: selectIndex === showCount })}
                value={excess.find((opt) => opt.shortName === deliveryCurrency)?.id ?? 0}
                matchWidth={false}
                placeholder={<div>{_t('more')}</div>}
                onChange={(_id) => {
                  changeCoinsById(_id);
                }}
                options={[
                  ...excess.map((tab) => ({
                    label: tab.shortName,
                    value: tab.id,
                    key: tab.id,
                  })),
                ]}
              />
            }
          />
        )}
      </Tabs>
    </StyledCoinTabs>
  );
});

function AllProjectLink() {
  const { isRTL } = useLocale();
  const ArrowIcon = isRTL ? ICArrowLeftOutlined : ICArrowRightOutlined;
  return (
    <StyledAllProjectLink
      variant="text"
      type="brandGreen"
      endIcon={<ArrowIcon size={16} />}
      size="mini"
      onClick={() => {
        push('/pre-market');
      }}
    >
      <span>{_t('833901e8b5d84000ad6e')}</span>
    </StyledAllProjectLink>
  );
}

export default function Banner({ coinTabsRef }) {
  const isInApp = JsBridge.isApp();
  const theme = useTheme();
  const deliveryCurrency = useSelector((state) => state.aptp.deliveryCurrency);
  const deliveryCurrencyInfo = useSelector((state) => state.aptp.deliveryCurrencyInfo);
  // const loadingCurrencyInfo = useSelector((state) => {
  //   return state.loading.effects['aptp/pullCurr  encyInfo'];
  // });
  // const [firstLoadingCurrencyInfo, setFirstLoadingCurrencyInfo] = useState(false);
  // useEffect(() => {
  //   if (loadingCurrencyInfo === false) {
  //     setFirstLoadingCurrencyInfo(true);
  //   }
  // }, [loadingCurrencyInfo]);
  const activityStatus = useActivityStatus();

  // const { isRTL } = useLocale();
  const size = useResponsiveSize();
  const isH5 = size === 'sm';

  return (
    <ThemeProvider theme={isH5 ? theme?.currentTheme || 'dark' : 'dark'}>
      <StyledBanner data-inspector="inspector_premarket_banner">
        <StyledBannerContainer>
          {deliveryCurrencyInfo?.id && (
            <WrapperCoinTabsContainer activityStatus={activityStatus}>
              {activityStatus === 3 ? (
                !isInApp && (
                  <BreadcrumbWrapper>
                    <Breadcrumb>
                      <Breadcrumb.Item>
                        <Link
                          to="/pre-market"
                          onClick={() => locateToUrlInApp('/pre-market')}
                          dontGoWithHref={isInApp}
                        >
                          {_t('p2oTgByxdzWA9H6cob7umF')}
                        </Link>
                      </Breadcrumb.Item>
                      <Breadcrumb.Item>{deliveryCurrency}</Breadcrumb.Item>
                    </Breadcrumb>
                    {isH5 && <MyOrderLink variant="text" />}
                  </BreadcrumbWrapper>
                )
              ) : (
                <WrapperCoinTabs ref={coinTabsRef}>
                  <CoinTabsBar>
                    <CoinTabs />
                    <CoinTabsActions>
                      {!isH5 && (
                        <>
                          <AllProjectLink />
                          <Divider type="vertical" />
                        </>
                      )}

                      <MyOrderLink variant="text" />
                    </CoinTabsActions>
                  </CoinTabsBar>
                </WrapperCoinTabs>
              )}
            </WrapperCoinTabsContainer>
          )}
          <Card />
        </StyledBannerContainer>
      </StyledBanner>
    </ThemeProvider>
  );
}
