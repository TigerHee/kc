/**
 * Owner: jessie@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useLocale } from '@kucoin-base/i18n';
import { ICArrowRightOutlined, ICHistoryOutlined } from '@kux/icons';
import { styled, Tab, Tabs, useResponsive } from '@kux/mui';
import { Link } from 'components/Router';
import debounce from 'lodash/debounce';
import moment from 'moment';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import LazyImg from 'src/components/common/LazyImg';
import { useSelector } from 'src/hooks/useSelector';
import logo1 from 'static/gempool/logo1.png';
import { _t } from 'tools/i18n';
import useActiveTabKey from 'TradeActivity/hooks/useActiveTabKey';
import { trackClick } from 'utils/ga';
import { locateToUrlInApp } from '../../../utils';
import { POOL_STATUS } from '../../config';
import QuestionModal from '../../containers/QuestionModal';
import StakingModal from '../../containers/StakingModal';
import TaskModal from '../../containers/TaskModal';
import UnStakingModal from '../../containers/UnStakingModal';
import SymbolInfoModal from '../containers/ProjectDetailItem/SymbolInfoModal';
import PoolCard from './ProjectDetailItem';

const StyledCurrent = styled.section`
  margin-top: 24px;
  margin-bottom: 64px;
  ${(props) => props.theme.breakpoints.up('sm')} {
    margin-top: 32px;
    margin-bottom: 64px;
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    margin-bottom: 80px;
  }
`;

const ListWrapper = styled.div`
  padding: 0 16px;
  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 0;
  }
`;
const TabsWrapper = styled.div`
  padding: 0 16px;
  margin-top: 16px;
  border-bottom: 1px solid ${(props) => props.theme.colors.divider8};
  position: -webkit-sticky;
  position: sticky;
  top: ${({ top }) => `${top}px`};
  background-color: ${(props) => props.theme.colors.overlay};
  z-index: 10;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  .extra {
    margin-left: 16px;
    text-align: right;
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 0;
  }
`;

const CurrentItemWrapper = styled.div`
  margin-top: 20px;
  ${(props) => props.theme.breakpoints.up('sm')} {
    margin-top: 24px;
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    margin-top: 32px;
  }
`;

const TitleWrapper = styled.h2`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  margin: 0;

  .title {
    display: flex;
    align-items: center;
    margin-right: 16px;
    color: ${(props) => props.theme.colors.text};
    font-weight: 700;
    font-size: 18px;
    font-style: normal;
    line-height: 130%;
    img {
      width: 24px;
      height: 24px;
      margin-right: 8px;
      transform: rotateY(0deg);
      [dir='rtl'] & {
        transform: rotateY(180deg);
      }
    }
  }

  .right {
    display: flex;
    align-items: center;
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 0;

    .title {
      font-size: 24px;
      img {
        width: 40px;
        height: 40px;
        margin-right: 16px;
      }
    }
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    padding: 0;
    .title {
      font-weight: 600;
      font-size: 36px;
      img {
        width: 48px;
        height: 48px;
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
  line-height: 130%;

  svg {
    transform: rotateY(0deg);
    [dir='rtl'] & {
      transform: rotateY(180deg);
    }
  }

  .appIcon {
    color: ${(props) => props.theme.colors.text};
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    font-size: 14px;
  }
`;

const emptyObj = {};

const TabsComp = memo(({ pools, extra }) => {
  const isInApp = JsBridge.isApp();
  const [cardTops, setCardTops] = useState([]);
  const [tabKey, setTabKey] = useState('');

  const dispatch = useDispatch();
  const { isRTL } = useLocale();
  const fristCurrency = useActiveTabKey();

  const headerHeight = useSelector((state) => state?.gempool?.headerHeight);

  const scrollTop = useMemo(() => {
    if (isInApp) {
      // app 内header + tab高度
      return headerHeight + 65;
    } else {
      // 非app均为tab高度
      return 65;
    }
  }, [isInApp, headerHeight]);

  const onTypeChange = useCallback(
    (value) => {
      const ele = document.getElementById(value);
      if (ele) {
        window.scrollTo({
          top: ele.offsetTop - scrollTop,
          behavior: 'smooth',
        });
      }
      setTimeout(() => {
        setTabKey(value);
      }, 0);
    },
    [scrollTop],
  );
  const handleChange = useCallback(
    debounce((e, value) => {
      onTypeChange(value);
    }, 60),
    [onTypeChange],
  );

  useEffect(() => {
    if (fristCurrency) {
      onTypeChange(fristCurrency);
    }
  }, [fristCurrency, onTypeChange]);

  useEffect(() => {
    if (pools?.length) {
      const arr = pools?.map((item, index) => {
        const ele = document.getElementById(item?.stakingToken);
        return ele?.offsetTop;
      });
      setCardTops(arr);
    }
  }, [pools, headerHeight]);

  useEffect(() => {
    if (pools?.length && !tabKey) {
      setTabKey(pools[0]?.stakingToken);
    }
  }, [pools, tabKey]);

  const handleScroll = useCallback(
    debounce(() => {
      if (cardTops?.length) {
        const top = window.document?.scrollingElement?.scrollTop;
        const scrollHeight = window.document?.scrollingElement?.scrollHeight;
        const clientHeight = window.document?.scrollingElement?.clientHeight;
        let cardIndex = 0;
        cardTops?.map((cardTop, index) => {
          if (top >= cardTop - scrollTop) {
            cardIndex = index;
          }
        });
        // 到底算最后一个
        if (top >= scrollHeight - clientHeight - 2) {
          cardIndex = cardTops?.length - 1;
        }
        setTabKey(pools[cardIndex]?.stakingToken);
      }
    }, 200),
    [dispatch, cardTops, pools, scrollTop],
  );

  useEffect(() => {
    window.addEventListener?.('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);
  return (
    <TabsWrapper top={headerHeight}>
      <Tabs
        value={tabKey}
        onChange={handleChange}
        variant="line"
        size="medium"
        showScrollButtons={false}
        centeredActive
        direction={isRTL ? 'rtl' : 'ltr'}
      >
        {pools?.map((item, index) => {
          return (
            <Tab
              label={_t('6c7d61047a164000a18b', { currency: item?.stakingToken })}
              value={item?.stakingToken}
              key={item?.stakingToken}
            />
          );
        })}
      </Tabs>
      {!!extra && <div className="extra">{extra}</div>}
    </TabsWrapper>
  );
});

export default function CurrentPools() {
  const isInApp = JsBridge.isApp();
  const { sm } = useResponsive();
  const dispatch = useDispatch();

  const isSm = !sm;

  const currentInfo = useSelector((state) => state.gempool.currentInfo, shallowEqual);

  const {
    pools,
    earnTokenLogo,
    earnTokenName,
    userBonusCoefficient,
    stakingStartTime,
    stakingEndTime,
    campaignId,
  } = currentInfo || emptyObj;

  const status = useMemo(() => {
    if (moment().isBefore(stakingStartTime)) {
      return POOL_STATUS.NOT_START;
    } else if (moment().isAfter(stakingEndTime)) {
      return POOL_STATUS.COMPLETED;
    }
    return POOL_STATUS.IN_PROCESS;
  }, [stakingStartTime, stakingEndTime]);

  useEffect(() => {
    dispatch({
      type: 'gempool/updateCampaignExtra',
      payload: {
        campaignId: campaignId,
      },
    });
  }, [campaignId, dispatch]);

  useEffect(() => {
    if (earnTokenName) {
      dispatch({
        type: 'gempool/pullGemPoolProjectDetail@polling',
        payload: {
          currency: earnTokenName,
        },
      });
      return () => {
        dispatch({
          type: 'gempool/pullGemPoolProjectDetail@polling:cancel',
          payload: {
            currency: earnTokenName,
          },
        });
        dispatch({
          type: 'gempool/update',
          payload: {
            currentInfo: emptyObj,
          },
        });
      };
    }
  }, [dispatch, earnTokenName]);

  const getProjectStatus = useCallback((startAt, endAt) => {
    if (moment().isBefore(startAt)) {
      return POOL_STATUS.NOT_START;
    } else if (moment().isAfter(endAt)) {
      return POOL_STATUS.COMPLETED;
    }
    return POOL_STATUS.IN_PROCESS;
  }, []);

  const handleLocateTo = useCallback(() => {
    trackClick(['Main', 'gempoolHistoricalReturns']);
    locateToUrlInApp('/gempool/historical-earnings');
  }, []);
  return (
    <>
      <StyledCurrent data-inspector="inspector_gempoolDetail_pools">
        {isSm ? (
          <>
            <TitleWrapper>
              <div className="title">
                <LazyImg src={logo1} alt="logo" />
                {_t('79ea42f5b7874000a139')}
              </div>
              <div className="right">
                <LinkWrapper
                  to={'/gempool/historical-earnings'}
                  onClick={handleLocateTo}
                  dontGoWithHref={isInApp}
                >
                  <ICHistoryOutlined size="16" className="appIcon" />
                </LinkWrapper>
              </div>
            </TitleWrapper>
            <TabsComp pools={pools} />
          </>
        ) : (
          <TabsComp
            pools={pools}
            extra={
              <LinkWrapper
                to={'/gempool/historical-earnings'}
                onClick={handleLocateTo}
                dontGoWithHref={isInApp}
              >
                {_t('62b56b869ea84000a68b')}
                <ICArrowRightOutlined size="16" />
              </LinkWrapper>
            }
          />
        )}

        <ListWrapper>
          {pools?.map((item) => {
            return (
              <CurrentItemWrapper key={item?.poolId} id={item?.stakingToken}>
                <PoolCard
                  {...item}
                  earnTokenLogo={earnTokenLogo}
                  earnTokenName={earnTokenName}
                  userBonusCoefficient={userBonusCoefficient}
                  campaignId={campaignId}
                  projectStatus={status}
                  status={getProjectStatus(item?.stakingStartTime, item?.stakingEndTime)}
                />
              </CurrentItemWrapper>
            );
          })}
        </ListWrapper>
      </StyledCurrent>
      <StakingModal type="detail" />
      <UnStakingModal />
      <QuestionModal type="detail" />
      <SymbolInfoModal />
      <TaskModal />
    </>
  );
}
