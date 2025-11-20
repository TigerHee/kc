/**
 * Owner: solar@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useLocale } from '@kucoin-base/i18n';
import {
  EmotionCacheProvider,
  Global,
  Snackbar,
  styled,
  Tab,
  Tabs,
  ThemeProvider,
  useResponsive,
} from '@kux/mui';
import { debounce, map } from 'lodash';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useSelector } from 'src/hooks/useSelector';
import useAppInit from 'TradeActivity/hooks/useAppInit';
import Share from 'TradeActivityCommon/Share';
import StickyTabs from 'TradeActivityCommon/StickyTabs';
import { replace } from 'utils/router';
import { exposePageStateForSSG } from 'utils/ssgTools';
import { PROJECT_TYPE, TABICONS, TABITEMS, TABKEYS, TABKEYSTRANSFORM } from './constant';
import Banner from './containers/Banner';
import Faq from './containers/Faq';
import NewCurrencyList from './containers/NewCurrencyList';
import OnGoingProject from './containers/OngoingProject';
import NewCurrencyProject from './containers/Project';

const { SnackbarProvider } = Snackbar;

export const ContentWrapper = styled.section`
  /* 高度占位 减少CLS */
  min-height: 200px;
  .KuxTabs-container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 24px 24px 0;
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    padding: 24px 0 0;
  }
`;

const StyledPage = styled.main`
  background: ${(props) => props.theme.colors.overlay};
`;

const TabsWrapper = styled.div`
  background: ${(props) => props.theme.colors.overlay};
  position: -webkit-sticky;
  position: sticky;
  top: ${({ top }) => `${top}px`};
  padding: 0 16px 16px;
  z-index: 10;
  .KuxTabs-Container {
    padding-top: 14px;
    .KuxTab-TabItem {
      -webkit-text-stroke: unset;
    }
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 0 0 24px;
    .KuxTabs-Container {
      padding-top: 0;
    }
  }
`;

const LabelWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  .mark {
    margin-left: 4px;
    padding: 2px 4px;
    font-weight: 500;
    font-size: 12px;
    font-style: normal;
    line-height: 130%;
    border-radius: 4px;
  }
  .fireIcon {
    width: 24px;
    height: 24px;
  }
  .newIcon {
    color: ${(props) => props.theme.colors.primary};
    background: ${(props) => props.theme.colors.primary8};
  }
  .liveIcon {
    color: ${(props) => props.theme.colors.complementary};
    background: ${(props) => props.theme.colors.complementary8};
  }
`;

const NewListing = memo(() => {
  const newListing = useSelector((state) => state.rocketZone.newListing, shallowEqual);
  if (!newListing?.length) return null;
  return <NewCurrencyProject details={newListing} typeName="newListing" />;
});

const OnGoings = memo(() => {
  const onGoingList = useSelector((state) => state.rocketZone.onGoingList, shallowEqual);
  const topHeight = useSelector((state) => state.rocketZone.topHeight);

  const onGoingTabs = useMemo(() => {
    const projectTypes = PROJECT_TYPE() || {};
    const _tabs = [];
    map(onGoingList, (item) => {
      if (item && projectTypes[item.typeName]) {
        _tabs.push({
          id: item.typeName,
          value: item.typeName,
          label: projectTypes[item.typeName].title,
        });
      }
    });
    return _tabs;
  }, [onGoingList]);

  return (
    <>
      <StickyTabs items={onGoingTabs} topHeight={topHeight || 0} />
      {map(onGoingList, (item) => {
        if (!item) return null;
        return <OnGoingProject {...item} id={item.typeName} />;
      })}
    </>
  );
});

const TabsContent = memo(({ tabKey }) => {
  const dispatch = useDispatch();
  const isInApp = JsBridge.isApp();
  const { sm, lg } = useResponsive();

  const isShowRestrictNotice = useSelector((state) => state?.$header_header?.isShowRestrictNotice);
  const headerHeight = useSelector((state) => state.rocketZone.headerHeight);
  const topHeight = useSelector((state) => state.rocketZone.topHeight);
  const bannerInfo = useSelector((state) => state.rocketZone.gemspaceBanner, shallowEqual);
  const { priorityDisplay, priorityDisplayTag } = bannerInfo || {};

  // tabs 排序
  const tabs = useMemo(() => {
    const _tabs = map(TABITEMS, (item) => {
      return {
        ...item,
        seq: item?.value === TABKEYSTRANSFORM[priorityDisplay] ? 1 : 100,
      };
    });
    return _tabs.sort((a, b) => a.seq - b.seq);
  }, [priorityDisplay]);

  const handleResize = useCallback(
    debounce(() => {
      const { height } = document
        .getElementsByClassName('gbiz-headeroom')?.[0]
        ?.getBoundingClientRect?.() ?? { height: 0 };
      const _height = isInApp ? 88 : height;
      if (_height !== headerHeight) {
        dispatch({ type: 'rocketZone/update', payload: { headerHeight: _height } });
      }

      const { height: _tabHeight } = document
        .getElementsByClassName('gemspaceHeaderTabs')?.[0]
        ?.getBoundingClientRect?.() ?? { height: 0 };
      const _topHeight = _height + _tabHeight;

      if (_topHeight !== topHeight) {
        dispatch({ type: 'rocketZone/update', payload: { topHeight: _topHeight } });
      }
    }, 1000),
    [headerHeight, topHeight, isInApp, dispatch],
  );

  // 移动端点击会调用两次，加上debounce防止页面重复刷新
  const handleTypeChange = useCallback(
    debounce((e, value) => {
      e.preventDefault();
      e.stopPropagation();

      // 使用replace，避免app内回退到上一tab,而不是关闭
      replace(`/gemspace/${value}`);
    }, 60),
    [],
  );

  useEffect(() => {
    handleResize();
  }, [handleResize, isShowRestrictNotice]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  return (
    <TabsWrapper
      top={headerHeight}
      className="gemspaceHeaderTabs"
      data-inspector="inspector_gemspace_tab"
    >
      <Tabs
        value={tabKey}
        onChange={handleTypeChange}
        variant="line"
        bordered={true}
        showScrollButtons={false}
        size={!sm ? 'medium' : lg ? 'xlarge' : 'large'}
      >
        {map(tabs, ({ label, value }, index) => {
          return (
            <Tab
              label={
                <LabelWrapper>
                  {label}
                  {index === 0 && TABICONS[priorityDisplayTag]}
                </LabelWrapper>
              }
              value={value}
              key={value}
            />
          );
        })}
      </Tabs>
    </TabsWrapper>
  );
});

const Content = memo(() => {
  const bannerInfo = useSelector((state) => state.rocketZone.gemspaceBanner, shallowEqual);
  const { priorityDisplay } = bannerInfo || {};

  const { type } = useParams();
  const dispatch = useDispatch();

  const [tabKey, setTabKey] = useState('');

  useEffect(() => {
    if (tabKey) {
      exposePageStateForSSG((dvaState) => {
        const rocketZone = dvaState.rocketZone;
        const gemspaceBanner = rocketZone?.gemspaceBanner;
        // bannerInfo 不存储数据
        const gemspaceBannerSSG = gemspaceBanner
          ? {
              priorityDisplay: gemspaceBanner.priorityDisplay,
              priorityDisplayTag: gemspaceBanner.priorityDisplayTag,
              subtitle: gemspaceBanner.subtitle,
            }
          : {};

        // 不同tab下的数据
        const tabDataInfo = {};
        // newlisting
        if (tabKey === TABKEYS.NEWLISTING) {
          tabDataInfo.newListing = rocketZone?.newListing || [];
          // 首页最多展示10条 截取一下防止state过大
          tabDataInfo.records = rocketZone?.records?.slice(0, 10) ?? [];
          // k线数据比较大，可先不在初始状态显示
          tabDataInfo.klinesMap = [];
          tabDataInfo.activeRate = rocketZone?.activeRate || 2;
        } else if (tabKey === TABKEYS.ONGOING) {
          // ongiong
          tabDataInfo.onGoingList = rocketZone?.onGoingList || [];
        }

        return {
          rocketZone: {
            ...tabDataInfo,
            gemspaceBanner: gemspaceBannerSSG,
          },
        };
      });
    }
  }, [tabKey]);

  useEffect(() => {
    const _type = type ? type.toLowerCase() : '';
    if (_type === TABKEYS.ONGOING) {
      setTabKey(TABKEYS.ONGOING);
    } else if (_type === TABKEYS.NEWLISTING) {
      setTabKey(TABKEYS.NEWLISTING);
    } else {
      // 为空或不支持时时重定向到优先展示key
      replace(`/gemspace/${TABKEYSTRANSFORM[priorityDisplay] || TABKEYS.NEWLISTING}`);
    }
  }, [type, priorityDisplay]);

  useEffect(() => {
    if (tabKey === TABKEYS.NEWLISTING) {
      dispatch({
        type: 'rocketZone/pullNewListing',
      });
    } else if (tabKey === TABKEYS.ONGOING) {
      dispatch({
        type: 'rocketZone/pullGemspaceOngoingGem@polling',
      });
      return () => {
        dispatch({
          type: 'rocketZone/pullGemspaceOngoingGem@polling:cancel',
        });
      };
    }
  }, [tabKey, dispatch]);

  // tabs 排序
  const cotentComp = useMemo(() => {
    if (!tabKey) return null;
    if (tabKey === TABKEYS.NEWLISTING) {
      return (
        <>
          <NewListing />
          <NewCurrencyList />
        </>
      );
    }

    return <OnGoings />;
  }, [tabKey]);

  if (!tabKey) return null;

  return (
    <ContentWrapper data-inspector="inspector_gemspace_content">
      <TabsContent tabKey={tabKey} />
      {cotentComp}
    </ContentWrapper>
  );
});

function RocketZone() {
  useAppInit();
  const dispatch = useDispatch();
  const { isRTL } = useLocale();

  const currentTheme = useSelector((state) => state.setting.currentTheme);

  useEffect(() => {
    dispatch({
      type: 'rocketZone/pullGemspaceBanner',
    });
  }, [dispatch]);

  return (
    <EmotionCacheProvider isRTL={isRTL}>
      <ThemeProvider theme={currentTheme}>
        <SnackbarProvider>
          <Global
            styles={`
            body *{
              font-family: Roboto;
            }
            [dir="rtl"] .KuxModalHeader-root .KuxModalHeader-close {
              right: 32px;
              left: unset;
            }
            body {
              [dir='rtl'] & .right_svg__icon, [dir='rtl'] & .left_svg__icon {
                transform: rotate(0deg);
              }
            }
          `}
          />
          <StyledPage id="gemspacePage">
            <Banner />
            <Content />
            <Faq />
            <Share utmSource="gemspace" />
          </StyledPage>
        </SnackbarProvider>
      </ThemeProvider>
    </EmotionCacheProvider>
  );
}

export default memo(RocketZone);
