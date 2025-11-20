/**
 * Owner: jessie@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useLocale } from '@kucoin-base/i18n';
import { Button, Tabs, Tab, useResponsive, Divider, EmotionCacheProvider, Global, Snackbar, styled, ThemeProvider } from '@kux/mui';
import moment from 'moment';
import { ICArrowRight2Outlined, ICArrowRightOutlined } from '@kux/icons';
import { Link } from 'components/Router';
import NoSSG, { IS_SSG_ENV } from 'src/components/NoSSG';
import Modal from 'TradeActivityCommon/Modal';
import LazyImg from 'src/components/common/LazyImg';
import GlobalTransferScope from 'components/Root/GlobalTransferScope';
import coinLogo from 'static/gempool/coin.svg';
import coinLogoDark from 'static/gempool/coinDark.svg';
import tipBgIcon from 'static/gempool/staking_tip_bg.svg';
import { trackClick } from 'utils/ga';
import { memo, useMemo, useEffect, useRef, useCallback } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import {
  locateToUrlInApp,
} from 'TradeActivity/utils';
import { exposePageStateForSSG } from 'utils/ssgTools';
import { _t } from 'tools/i18n';
import Banner from './containers/Banner';
import CurrentProjects, { EntranceWrapper } from './containers/CurrentProjects';
import FAQ from './containers/FAQ';
import HistoryProjects from './containers/HistoryProjects';
import RewardsModal from './containers/RewardsModal';
import { useStakingUrl } from '../ActivityCommon/hooks';
import {
  ContentWrapper as TipContentWrapper,
  ButtonWrapper,
} from './containers/ProjectItem/styledComponents';
import { POOL_STATUS } from './config';

const isInApp = JsBridge.isApp();

const { SnackbarProvider } = Snackbar;

const StyledPage = styled.main`
  background: ${(props) => props.theme.colors.overlay};
`;

export const ContentWrapper = styled.section`
  margin-top: 16px;

  ${(props) => props.theme.breakpoints.up('sm')} {
    margin-top: 40px;
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    margin-top: 64px;
  }
`;

export const BaseContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 0 24px;

  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 40px 24px;
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    padding: 64px 0;
  }
`;

const StakingTipWrapper = styled.div`
  position: relative;
  display: flex;
  padding: 12px 24px;
  margin-bottom: 20px;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  border-radius: 0;
  border: 1px solid ${(props) => props.theme.colors.primary12};
  background: ${(props) => props.theme.colors.primary4};
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 1.3;
  color: ${(props) => props.theme.colors.text};
  cursor: default;
  overflow: hidden;
  ${(props) => props.theme.breakpoints.up('sm')} {
    border-radius: 16px;
    margin-bottom: 32px;
    padding: 11px 24px;
  }
  img.coinLogo {
    width: 24px;
    height: 24px;
    margin-right: 12px;
  }
  .tipBgIcon {
    position: absolute;
    width: 120px;
    height: 150%;
    z-index: 0;
    display: none;
    ${(props) => props.theme.breakpoints.up('sm')} {
      display: block;
      width: 75px;
      left: 158px;
    }
  }
  .desc {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex: 1;
    font-size: 12px;
    font-weight: 500;
    line-height: 1.5;
    ${(props) => props.theme.breakpoints.up('sm')} {
      line-height: 1.3;
      flex-direction: row;
      align-items: center;
      font-size: 14px;
    }
    .tip {
      flex: 1;
      word-break: break-word;
    }
    .link {
      margin-left: 0;
      margin-top: 8px;
      font-weight: 500;
      ${(props) => props.theme.breakpoints.up('sm')} {
        margin-left: 24px;
        margin-top: 0;
        font-weight: 400;
      }
      a {
        text-decoration-line: none;
        display: inline-flex;
        align-items: center;
      }
      .icon {
        margin-left: 4px;
        [dir=rtl] & {
          transform: scale(-1);
        }
      }
    }
  }
`;

const TabsWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  justify-content: space-between;
  margin: 0;
  .tab {
    width: 100%;
    border-bottom: 1px solid ${props => props.theme.colors.divider8};
    .KuxTabs-container {
      padding: 0 16px;
    }
    .KuxTab-TabItem {
      color: ${props => props.theme.colors.text40};
      font-size: 20px;
      font-weight: 400;
      &.KuxTab-selected {
        color: ${props => props.theme.colors.text};
        font-weight: 500;
      }
    }
    ${(props) => props.theme.breakpoints.down('sm')} {
      .KuxTab-TabItem {
        font-size: 15px;
        font-weight: 500;
      }
    }
  }
  .right {
    display: flex;
    align-items: center;
    margin-top: 20px;
    width: 100%;
    padding: 0 16px;
  }
  ${(props) => props.theme.breakpoints.up('sm')} {
    flex-direction: row;
    align-items: center;
    margin-top: 0;
    .tab {
      width: auto;
      border-bottom: none;
      .KuxTabs-container {
        padding: 0;
      }
    }
    .right {
      width: auto;
      padding: 0;
      margin-top: 0;
      .KuxDivider-vertical {
        margin: 0 16px;
      }
    }
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    .right {
      .KuxDivider-vertical {
        margin: 0 24px;
      }
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
  flex: 1;
  // line-height: 130%;

  svg {
    transform: rotate(0deg);
    [dir='rtl'] & {
      transform: rotate(180deg);
    }
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    font-size: 14px;
  }
`;

const emptyArr = [];

const StakingTipComp = () => {
  const isInApp = JsBridge.isApp();
  const currentTheme = useSelector((state) => state.setting.currentTheme);
  const stakingUrl = useStakingUrl();
  return (
    <StakingTipWrapper
        onClick={(e) => {
          e.preventDefault && e.preventDefault();
          e.stopPropagation && e.stopPropagation();
        }}
      >
        <img className='tipBgIcon' src={tipBgIcon} alt='tipBgIcon' />
        <LazyImg
          src={currentTheme === 'dark' ? coinLogoDark : coinLogo}
          alt="gift"
          className="coinLogo"
        />
        <div className="desc">
          <span className='tip'>{_t('f4b1480646ec4800a30a')}</span>
          <div className='link'>
            <Link to={stakingUrl} onClick={() => locateToUrlInApp(stakingUrl)} dontGoWithHref={isInApp}>
              {_t('37bd3a341c174000a02c')}
              <ICArrowRight2Outlined className="icon" />
            </Link>
          </div>
        </div>
      </StakingTipWrapper>
  );
}

const RewardsEntrance = memo(() => {
  const dispatch = useDispatch();
  const unclaimedCampaigns = useSelector((state) => state.gempool.unclaimedCampaigns, shallowEqual);
  const totalUnclaimedNums = useSelector((state) => state.gempool.totalUnclaimedNums);

  const handleVisible = useCallback(() => {
    dispatch({
      type: 'gempool/update',
      payload: {
        rewardsModal: true,
      },
    });
  }, [dispatch]);

  
  // if (!unclaimedCampaigns?.length) {
  //   return null;
  // }

  const toClaimedList = unclaimedCampaigns.filter(i => i.unclaimedRewards > 0);
  // 注意：待领取奖励数量是根据池子数量而不是活动数量，有可能出现外面显示3而弹框中tab里只有两个可领取（可能一个活动里包含两个池子，一个活动里有一个池子）
  return (
    <EntranceWrapper onClick={handleVisible}>
      {toClaimedList.length ? (
        <div className="icons">
          {toClaimedList?.slice(0, 3)?.map((item) => (
            <LazyImg src={item?.earnTokenLogo} alt="logo" key={item?.campaignId} />
          ))}
        </div>
      ) : null}

      <div className="text">{_t('f47de15f14204000a9d1', { num: totalUnclaimedNums || '0' })}</div>
    </EntranceWrapper>
  );
});

const ActivtiyTabsType = {
  onGoing: 'onGoing',
  ended: 'ended',
}
function ActivtiyTabs ({
  user,
  currentList,
  value,
  onChange,
  onGoingCount,
  endedCount,
 }) {
  const { sm } = useResponsive();
  const isSm = !sm;


  const handleLocateTo = useCallback(() => {
    trackClick(['Main', 'gempoolHistoricalReturns']);
    locateToUrlInApp('/gempool/historical-earnings');
  }, []);

  return (
    
    <TabsWrapper>
      <div className='tab'>
        <Tabs
          value={value}
          onChange={onChange}
          variant="line"
          size={isSm ? 'small' : 'large'}
        >
          <Tab label={_t('dad9583d67324800ae5c', { count: onGoingCount})} value={ActivtiyTabsType.onGoing} data-inspector="inspector_gempool_current_tab" />
          <Tab label={_t('9840454256414800a8c9', { count: endedCount})} value={ActivtiyTabsType.ended} data-inspector="inspector_gempool_history_tab" />
        </Tabs>
      </div>
      <div className="right">
        {user && !!currentList?.length ? <RewardsEntrance /> : null}
        {user && !isSm && !!currentList?.length ? <Divider type="vertical" /> : null}
        {!isSm ? (
          <LinkWrapper
            to={'/gempool/historical-earnings'}
            onClick={handleLocateTo}
            dontGoWithHref={isInApp}
          >
            {_t('4f35196032954000a1a9')}
            <ICArrowRightOutlined size="16" />
          </LinkWrapper>
        ) : null}
      </div>
    </TabsWrapper>
  )
}

function GemPool() {
  const dispatch = useDispatch();
  const { isRTL } = useLocale();
  const isInApp = JsBridge.isApp();
  const currentTheme = useSelector((state) => state.setting.currentTheme);

  // 如果在app内，从app登录返回时，应再次触发init
  useEffect(() => {
    if (isInApp) {
      JsBridge.listenNativeEvent.on('onLogin', () => {
        dispatch({
          type: 'app/initApp',
        });
      });
    }
  }, [dispatch, isInApp]);

  useEffect(() => {
    exposePageStateForSSG((dvaState) => {
      const gempoolState = dvaState.gempool || {};

      return {
        gempool: {
          bannerInfo: gempoolState.bannerInfo || {},
          totalUnclaimedNums: gempoolState.totalUnclaimedNums || 0,
          unclaimedCampaigns: gempoolState.unclaimedCampaigns || [],
          currentRecords: gempoolState.currentRecords || [],
          historyRecords: gempoolState.historyRecords || [],
          currentTab: gempoolState.currentTab,
        },
      };
    });
  }, []);

  // tab选中值
  const tabValue = useSelector((state) => state.gempool.currentTab, shallowEqual);
  const setTabValue = (currentTab) => {
    dispatch({
      type: 'gempool/update',
      payload: {
        currentTab
      }
    });
  }

  const user = useSelector((state) => state.user.user, shallowEqual);
  
  // 获取进行中项目，相关数据
  useEffect(() => {
    dispatch({
      type: 'gempool/pullGemPoolRecords@polling',
    });
    return () => {
      dispatch({
        type: 'gempool/pullGemPoolRecords@polling:cancel',
      });
    };
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      // 待领取奖励项目数和额度
      dispatch({
        type: 'gempool/pullGemPoolUnclaimedRewardsNum@polling',
      });
      // gempool质押查询kcs可用余额
      dispatch({
        type: 'gempool/pullGempoolBalance@polling',
      });
      return () => {
        dispatch({
          type: 'gempool/pullGemPoolUnclaimedRewardsNum@polling:cancel',
        });
        dispatch({
          type: 'gempool/pullGempoolBalance@polling:cancel',
        });
      };
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (user) {
      dispatch({
        type: 'gempool/pullGemPoolUnclaimedRewards',
      });
      // 登录后立即拉取一次列表数据
      dispatch({
        type: 'gempool/pullGemPoolRecords',
      });
    }
  }, [dispatch, user]);

  // 获取历史项目列表
  useEffect(() => {
    dispatch({
      type: 'gempool/pullGemPoolHistoryRecords',
    });
  }, [dispatch]);

  // 获取进行中项目列表
  const currentRecords = useSelector((state) => state.gempool.currentRecords, shallowEqual);

  const getProjectStatus = useCallback((startAt, endAt) => {
    if (moment().isBefore(startAt)) {
      return POOL_STATUS.NOT_START;
    } else if (moment().isAfter(endAt)) {
      return POOL_STATUS.COMPLETED;
    }
    return POOL_STATUS.IN_PROCESS;
  }, []);

  const list = useMemo(() => {
    if (currentRecords?.length) {
      return currentRecords?.map((item) => {
        const status = getProjectStatus(item?.stakingStartTime, item?.stakingEndTime);
        // 过滤已结束的项目
        if (status !== POOL_STATUS.COMPLETED) {
          return {
            ...item,
            status,
          };
        }
      }).filter(project => !!project)
    }
    return emptyArr;
  }, [currentRecords, getProjectStatus]);

  // 获取历史项目列表
  const historyRecords = useSelector((state) => state.gempool.historyRecords, shallowEqual);

  const onGoingCount = list.length;
  const endedCount = historyRecords?.totalNum || 0;

  // 计算首次进入页面的tab值
  const isAutoSwitchTab = useSelector((state) => state.gempool.isAutoSwitchTab, shallowEqual);
  const isAutoSwitchTabRef = useRef();
  isAutoSwitchTabRef.current = isAutoSwitchTab;
  
  useEffect(() => {
    // ssg环境单独处理
    if (IS_SSG_ENV) {
      dispatch({
        type: 'gempool/update',
        payload: {
          currentTab: onGoingCount < 1 ? 'ended' : 'onGoing',
        },
      })
      return;
    }
    if (isAutoSwitchTabRef.current) return;
    if (onGoingCount < 1) return;
    dispatch({
      type: 'gempool/update',
      payload: {
        currentTab: 'onGoing',
        isAutoSwitchTab: true,
      },
    })
  }, [
    dispatch,
    onGoingCount,
  ]);

  const openTip = useSelector((state) => state.gempool.openCliamEmptyTip, shallowEqual);

  const closeTip = () => {
    dispatch({
      type: 'gempool/update',
      payload: {
        openCliamEmptyTip: false,
      }
    })
  };

  return (
    <EmotionCacheProvider isRTL={isRTL}>
      <ThemeProvider theme={currentTheme}>
        <SnackbarProvider>
          <Global
            styles={`
            body *{
              font-family: 'Roboto';
            }
            body fieldset {
              min-width: initial;
              padding: initial;
              margin: initial;
              border: initial;
              margin-inline-start: 2px;
              margin-inline-end: 2px;
              padding-block-start: 0.35em;
              padding-inline-start: 0.75em;
              padding-inline-end: 0.75em;
              padding-block-end: 0.625em;
            }
            body legend {
              width: initial;
              padding: initial;
              padding-inline-start: 2px;
              padding-inline-end: 2px;
            }
            body {
              [dir='rtl'] & .right_svg__icon, [dir='rtl'] & .left_svg__icon {
                transform: rotate(0deg);
              }
            }
            body {
              .root {
                background: ${currentTheme === 'light' ? '#ffffff' : '#121212'};

                ${
                  isInApp
                    ? `
                    &::-webkit-scrollbar {
                      display: none;
                    }
                    &::-webkit-scrollbar-thumb {
                      display: none;
                    }
                    &::-webkit-scrollbar-track {
                      display: none;
                    }
                    `
                    : ''
                }
              }
            }
          `}
          />
          <GlobalTransferScope />

          <StyledPage id="gempoolPage">
            <Banner />
            <BaseContainer>
              <StakingTipComp />
              <ActivtiyTabs
                value={tabValue}
                onChange={(_, newTab) => setTabValue(newTab)}
                onGoingCount={onGoingCount}
                endedCount={endedCount}
                user={user}
                currentList={list}
              />
              {tabValue === ActivtiyTabsType.onGoing && <CurrentProjects list={list} />}
              {tabValue === ActivtiyTabsType.ended && <HistoryProjects historyRecords={historyRecords} /> }
              <FAQ showDisclaim />
            </BaseContainer>
          </StyledPage>
          <RewardsModal />
          <NoSSG>
            <Modal
              open={openTip}
              onClose={closeTip}
              title={_t('1ca9c911dd1b4000aed8')}
              showCloseX={true}
              maskClosable={false}
              showDialog
              size="basic"
              maskProps={{
                onClick: (e) => {
                  if (e) e.stopPropagation();
                }
              }}
              rootProps={{
                onClick: (e) => {
                  if (e) e.stopPropagation();
                }
              }}
            >
              <TipContentWrapper>
                {_t('213ab02996f14800ace9')}
              </TipContentWrapper>
              <ButtonWrapper>
                <Button fullWidth size="basic" onClick={closeTip}>
                  {_t('87135cebc25e4000aaab')}
                </Button>
              </ButtonWrapper>
            </Modal>
          </NoSSG>
        </SnackbarProvider>
      </ThemeProvider>
    </EmotionCacheProvider>
  );
}

export default memo(GemPool);
