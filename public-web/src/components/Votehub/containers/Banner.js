/**
 * Owner: jessie@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useLocale } from '@kucoin-base/i18n';
import {
  ICArrowRightOutlined,
  ICHistoryOutlined,
  ICNoviceGuideOutlined,
  ICShareOutlined,
} from '@kux/icons';
import { Button, useSnackbar } from '@kux/mui';
import { numberFormat } from '@kux/mui/utils';
import { map } from 'lodash';
import moment from 'moment';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { shallowEqual, useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import siteCfg from 'src/utils/siteConfig';
import { _t, _tHTML } from 'tools/i18n';
import { trackClick } from 'utils/ga';
import { IS_SSG_ENV } from 'utils/ssgTools';
// import { ReactComponent as GuideSvg } from 'static/aptp/ic2_novice_guide.svg';
import Tooltip from '../components/Tooltip';
import { useActivityTime, useResponsiveSize, useShare } from '../hooks';
import {
  ActivityCardButton,
  ActivityCardContainer,
  ActivityCardInfo,
  ActivityCardStatus,
  ActivityCardTitle,
  BannerContainer,
  CountdownInDay,
  CountdownMoreDay,
  CountdownWrapper,
  NoCurrencyText,
  ProjectListWrapper,
  ProjectListWrapper2,
  RecordListWrapper,
  StyledBanner,
} from '../styledComponents';
import { skip2Login, skip2Url } from '../util';

const { KUCOIN_HOST_COM } = siteCfg;

const dayNum = 24 * 60 * 60;
const Coutdwon = memo(() => {
  const { voteStartTime, voteEndTime } = useActivityTime();

  const time = voteStartTime >= 0 ? voteStartTime : voteEndTime;

  const isEnd = useMemo(() => {
    return voteStartTime === -1;
  }, [voteStartTime]);

  const CountdownComp = useMemo(() => {
    if (time > dayNum) {
      const day = Math.ceil(time / dayNum);
      return (
        <CountdownMoreDay>
          {_tHTML(isEnd ? 'emeGDVD8GXBui1oZhwoGJz' : '2mLWexWQ9aDsgnRwqnJiha', {
            day,
          })}
        </CountdownMoreDay>
      );
    } else {
      const hour = Math.floor(time / 3600);
      const minute = Math.floor((time - 3600 * hour) / 60);
      const second = time - 3600 * hour - 60 * minute;
      const hourStr = `${hour < 10 ? '0' : ''}${hour}`;
      const minuteStr = `${minute < 10 ? '0' : ''}${minute}`;
      const secondStr = `${second < 10 ? '0' : ''}${second}`;

      return (
        <CountdownInDay>
          {_tHTML(isEnd ? 'dwsqSyVp6F7GmKqm8jyVg2' : 'vMvRHLPnadZnvoMPyLVnSg', {
            hourStr,
            minuteStr,
            secondStr,
          })}
        </CountdownInDay>
      );
    }
  }, [time, isEnd]);

  return <CountdownWrapper>{CountdownComp}</CountdownWrapper>;
});

// 轮播动画
const ProjectList = memo(() => {
  const timeRef = useRef(null);
  const numRef = useRef(0);
  const size = useResponsiveSize();
  const { isRTL } = useLocale();
  const [num, setNum] = useState(0);

  const activityStatus = useSelector((state) => state.votehub.activityStatus);
  const currenctPojectList = useSelector((state) => state.votehub.currenctPojectList, shallowEqual);
  const winProjectList = useSelector((state) => state.votehub.winProjectList, shallowEqual);

  const list = useMemo(() => {
    let _list = [];
    if (activityStatus === 3) {
      _list = winProjectList;
    } else {
      _list = currenctPojectList;
    }

    // 需要轮播动画
    if (_list?.length >= 3) {
      // 前加一后各加三
      // return _list.concat(_list).concat(_list);
      return _list
        .slice(_list.length - 1)
        .concat(_list)
        .concat(_list.slice(0, 3));
    } else {
      return _list;
    }
  }, [activityStatus, currenctPojectList, winProjectList]);

  useEffect(() => {
    const len = list?.length;
    if (len > 3) {
      timeRef.current = setInterval(() => {
        const index = numRef.current;
        if (index < len - 4) {
          numRef.current += 1;
        } else {
          numRef.current = 0;
        }
        setNum(numRef.current);
      }, 2500);
      return () => {
        if (timeRef.current) {
          clearInterval(timeRef.current);
        }
      };
    }
  }, [list]);

  // 未开始，不显示
  if (activityStatus === 0) {
    return null;
  } else if (activityStatus === 2 && !list?.length) {
    // 投票阶段数量为0
    return <NoCurrencyText>{_t('wJqyyCZ954Ct6iHhTekLof')}</NoCurrencyText>;
  } else if (list?.length > 3) {
    return (
      <ProjectListWrapper2>
        <div className="carousel">
          <div
            className="inner"
            style={{
              transform: isRTL
                ? `translate3d(${(size === 'sm' ? 14 : 22) * num + 1}px, 0, 0)`
                : `translate3d(-${(size === 'sm' ? 14 : 22) * num + 1}px, 0, 0)`,
            }}
          >
            {map(list, (item, index) => {
              return (
                <img
                  className={`projectIcon ${index === num ? 'fadeOut' : ''} ${
                    index === num + 3 ? 'fadeIn' : ''
                  } ${index >= num && index < num + 3 ? 'active' : ''}`}
                  key={`projectIcon_${index}`}
                  alt="icon"
                  src={item?.logoUrl}
                />
              );
            })}
          </div>
        </div>
      </ProjectListWrapper2>
    );
  } else {
    return (
      <ProjectListWrapper>
        {map(list, (item, index) => {
          return (
            <img
              className="projectIcon"
              key={`projectIcon_${index}`}
              alt="icon"
              src={item?.logoUrl}
            />
          );
        })}
      </ProjectListWrapper>
    );
  }
});

const ActivityCard = ({}) => {
  // const isInApp = JsBridge.isApp();
  const size = useResponsiveSize();
  const dispatch = useDispatch();
  const { currentLang } = useLocale();

  const pageInfo = useSelector((state) => state.votehub.pageInfo, shallowEqual);
  const activityStatus = useSelector((state) => state.votehub.activityStatus);
  const votesNum = useSelector((state) => state.votehub.votesNum);
  const user = useSelector((state) => state.user.user, shallowEqual);
  const currenctPojectList = useSelector((state) => state.votehub.currenctPojectList, shallowEqual);
  const isActivityResultPublished = useSelector((state) => state.votehub.isActivityResultPublished);
  const nominationPermission = useSelector((state) => state.votehub.nominationPermission);

  const handleModalVisible = useCallback(() => {
    dispatch({
      type: 'votehub/update',
      payload: {
        playModal: true,
      },
    });
  }, [dispatch]);

  const handleMoreTicket = useCallback(() => {
    dispatch({
      type: 'votehub/update',
      payload: {
        taskModal: true,
      },
    });
  }, [dispatch]);

  const handle2Vote = useCallback(() => {
    skip2Url('/gemvote/voting');
  }, []);

  const handle2Record = useCallback(() => {
    if (!user) {
      skip2Login();
      return;
    }

    skip2Url('/gemvote/record');
  }, [user]);

  const handleNomination = useCallback(() => {
    trackClick(['main', 'nominate']);

    if (!user) {
      skip2Login();
      return;
    }

    dispatch({
      type: 'votehub/update',
      payload: {
        nominationModal: true,
      },
    });
  }, [dispatch, user]);

  const StatusText = useMemo(() => {
    if (activityStatus === 0) {
      return _t('365thGV8HfajiQZvM7VDaC');
    }
    if (activityStatus === 1) {
      return _t('nXWMxSZrUAUXzscd1bAHBA');
    }
    if (activityStatus === 2) {
      return _t('opgGWM9KfpcnhxygjV4nnK');
    }
    if (activityStatus === 3) {
      // 根据结果是否已公布 展示文案
      return isActivityResultPublished
        ? _t('6E5A9UhkhN67DRKW9hF9kV')
        : _t('j92tbvsvTrHZm6pRJfDr5Z');
    }
  }, [activityStatus, isActivityResultPublished]);

  const ActivityCardButtonComp = useMemo(() => {
    let btn;
    if (!user) {
      btn = (
        <Button fullWidth size={size === 'sm' ? 'basic' : 'large'} onClick={skip2Login}>
          {_t('qXQDAbAWfbjfPzVQpDBXSV')}
        </Button>
      );
    } else if (activityStatus === 1) {
      btn = (
        <Button
          type="default"
          fullWidth
          size={size === 'sm' ? 'basic' : 'large'}
          onClick={handleMoreTicket}
        >
          {_t('pLo9eq3PpGeqhUr1Bzbp2p')}
        </Button>
      );
    } else if (activityStatus === 2) {
      btn = (
        <>
          <Button
            type="default"
            fullWidth
            size={size === 'sm' ? 'basic' : 'large'}
            onClick={handleMoreTicket}
          >
            {_t('pLo9eq3PpGeqhUr1Bzbp2p')}
          </Button>
          <Button
            fullWidth
            size={size === 'sm' ? 'basic' : 'large'}
            onClick={handle2Vote}
            disabled={!currenctPojectList?.length}
          >
            {_t('ips1Y4wuXPd3RaPfoYyRSG')}
          </Button>
        </>
      );
    } else if (activityStatus === 3) {
      btn = (
        <Button fullWidth size={size === 'sm' ? 'basic' : 'large'} onClick={handleMoreTicket}>
          {_t('pLo9eq3PpGeqhUr1Bzbp2p')}
        </Button>
      );
    }
    if (btn) {
      return <ActivityCardButton>{btn}</ActivityCardButton>;
    }
  }, [activityStatus, size, user, currenctPojectList, handleMoreTicket, handle2Vote]);

  useEffect(() => {
    if (user) {
      dispatch({
        type: 'votehub/pullCheckPermissions',
      });
    }
  }, [dispatch, user]);

  return (
    <ActivityCardContainer>
      {activityStatus !== 0 ? (
        <ActivityCardTitle>
          <Tooltip title={pageInfo?.title}>
            <div className="title">{pageInfo?.title}</div>
          </Tooltip>

          {pageInfo?.voteEndAt >= moment() ? (
            <div className="time">
              <Coutdwon />
            </div>
          ) : null}
        </ActivityCardTitle>
      ) : null}

      <ActivityCardStatus>
        <div className="projectInfo">
          <div className="status">{StatusText}</div>
          <ProjectList />
        </div>
        {pageInfo?.rule && (
          <Tooltip title={_t('8TcsjLCx7TMfxvrTzeRkRc')} disabledOnMobile={true}>
            <ICNoviceGuideOutlined onClick={handleModalVisible} />
          </Tooltip>
        )}
      </ActivityCardStatus>
      <div className="hr" />
      <ActivityCardInfo>
        <div className="ticketNumber">
          {_t('uPMR7hojGZGGf6knAP7iQc')}
          <div className="value">
            {user && !IS_SSG_ENV
              ? +votesNum
                ? numberFormat({ lang: currentLang, number: votesNum })
                : '0'
              : '--'}
          </div>
        </div>
        {user && nominationPermission && (
          <div className="ticketList" onClick={handleNomination} tabIndex={-1} role="button">
            {_t('h23WVkvReUZqDFbgCLXT2u')}
            <ICArrowRightOutlined />
          </div>
        )}
      </ActivityCardInfo>
      {ActivityCardButtonComp}
      <RecordListWrapper
        onClick={handle2Record}
        tabIndex={-1}
        role="button"
        isMore={!ActivityCardButtonComp}
      >
        <ICHistoryOutlined />
        {_t('qMoBPqEqCyFrC7MuzfS7P3')}
      </RecordListWrapper>
    </ActivityCardContainer>
  );
};

const Banner = () => {
  const isInApp = JsBridge.isApp();
  const dispatch = useDispatch();
  const { message } = useSnackbar();
  const handleShare = useShare();
  const user = useSelector((state) => state.user.user, shallowEqual);
  const referralCode = useSelector((state) => state.user.referralCode, shallowEqual);

  const handleRuleModalVisible = useCallback(() => {
    dispatch({
      type: 'votehub/update',
      payload: {
        ruleModal: true,
      },
    });
  }, [dispatch]);

  const size = useResponsiveSize();

  return (
    <StyledBanner data-inspector="inspector_votehub_banner" isInApp={isInApp}>
      <BannerContainer>
        <article>
          <h1>{_t('sGrZ4ahYsNEjJ4tptteG7u')}</h1>
          <p>{_t('mNvdmqHJQyFcuXt9YcR41w')}</p>
          <div className="btnGroup">
            <Button
              type="default"
              size={size === 'sm' ? 'mini' : 'basic'}
              onClick={handleRuleModalVisible}
            >
              <ICNoviceGuideOutlined size={size === 'sm' ? 12 : 16} />
              {_t('b9hmARke7vQqULYooJpW2r')}
            </Button>
            {isInApp || !user ? (
              <Button type="default" size={size === 'sm' ? 'mini' : 'basic'} onClick={handleShare}>
                <ICShareOutlined size={size === 'sm' ? 12 : 16} />
                {_t('cQ9UspV9MMQorjJYdq2FFx')}
              </Button>
            ) : (
              <CopyToClipboard
                text={`${window.location.href}?rcode=${referralCode}`}
                onCopy={() => {
                  trackClick(['main', 'share']);
                  message.success(_t('copy.succeed'));
                }}
              >
                <Button type="default" size={size === 'sm' ? 'mini' : 'basic'}>
                  <ICShareOutlined size={size === 'sm' ? 12 : 16} />
                  {_t('cQ9UspV9MMQorjJYdq2FFx')}
                </Button>
              </CopyToClipboard>
            )}
          </div>
        </article>
        <div className="activeCard">
          <ActivityCard />
        </div>
      </BannerContainer>
    </StyledBanner>
  );
};

export default memo(Banner);
