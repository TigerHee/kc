/**
 * Owner: jessie@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useLocale } from '@kucoin-base/i18n';
import { ICCampaignOutlined } from '@kux/icons';
import { Alert, useResponsive } from '@kux/mui';
import { dateTimeFormat } from '@kux/mui/utils';
import { useCountDown } from 'ahooks';
import map from 'lodash/map';
import moment from 'moment';
import { memo, useCallback, useMemo } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import LazyImg from 'src/components/common/LazyImg';
import { useSelector } from 'src/hooks/useSelector';
import { _t, _tHTML } from 'tools/i18n';
import { trackClick } from 'utils/ga';
import { locateToUrl, locateToUrlInApp, transformTimeStr } from '../../../utils';
import { POOL_STATUS, REMARK_STATUS_TEXT } from '../../config';
import NumFormatComp from './NumFormatComp';
import PoolCard, { EntranceComp } from './PoolCard';
import {
  AlertWrapper,
  AnnouncementWrapper,
  ColoumnWrapper,
  CountDownFullWarpper,
  CountDownTagWarpper,
  CurrencyInfoWrapper,
  H5ProjectInfoWrapper,
  PoolListWrapper,
  ProjectDataWrapper,
  ProjectInfoWrapper,
  StyledProjectItem,
  ThreeColoumnWrapper,
  TwoColoumnWrapper,
} from './styledComponents';

const dayMilSecondNum = 1000 * 60 * 60 * 24;

const CountDownComp = memo(({ date, isTag }) => {
  const dispatch = useDispatch();
  const handleDataList = useCallback(() => {
    dispatch({
      type: 'gempool/pullGemPoolRecords',
    });
  }, [dispatch]);

  // const countDown = useCountDown();
  // const [days, hours, minutes, seconds] = countDown(date);

  const [__, formattedRes] = useCountDown({
    targetDate: date,
    onEnd: handleDataList,
    interval: 1000,
  });

  const { days, hours, minutes, seconds } = formattedRes;

  if (isTag) {
    return (
      <CountDownTagWarpper>
        {_tHTML('0629effe3b614000a4a9', {
          days: transformTimeStr(days),
          hours: transformTimeStr(hours),
          minutes: transformTimeStr(minutes),
          seconds: transformTimeStr(seconds),
        })}
      </CountDownTagWarpper>
    )
  }
  return (
    <CountDownFullWarpper>
      {_tHTML('01e2c9386a3c4000abdc', {
        day: days,
        hour: transformTimeStr(hours),
        minute: transformTimeStr(minutes),
        second: transformTimeStr(seconds),
      })}
    </CountDownFullWarpper>
  );
});

const AnnouncementContent = memo(({ announcementAddress }) => {
  const handleLocateTo = useCallback(
    (e) => {
      e.preventDefault && e.preventDefault();
      e.stopPropagation && e.stopPropagation();

      locateToUrl(announcementAddress);
    },
    [announcementAddress],
  );

  if (!announcementAddress) {
    return null;
  }

  return (
    <AnnouncementWrapper onClick={handleLocateTo}>
      <ICCampaignOutlined />
      {`${_t('c8b9b2cd8f4b4000a4f4')}>>`}
    </AnnouncementWrapper>
  );
});

function ActivityTag({
  status,
  showTopCountdown,
  stakingEndTime,
}) {
  const isProcessing = status === POOL_STATUS.IN_PROCESS;
  const statusText = REMARK_STATUS_TEXT[status];
  if (!statusText) return null;
  if (isProcessing && showTopCountdown) {
    return (
      <div className='tag'>
        <CountDownComp date={stakingEndTime} isTag />
      </div>
    )
  }
  return <div className="mark">{_t(REMARK_STATUS_TEXT[status])}</div>
}

export default function ProjectItem(item) {
  const { sm, lg } = useResponsive();
  const { currentLang } = useLocale();
  const isInApp = JsBridge.isApp();

  const user = useSelector((state) => state.user.user, shallowEqual);

  const {
    campaignId,
    earnTokenName,
    totalReturns,
    earnTokenLogo,
    earnTokenOverview,
    stakingStartTime,
    stakingEndTime,
    openBonusTask,
    userBonusTaskFinish,
    userBonusCoefficient,
    announcementAddress,
    pools,
    status,
    showTopCountdown,
  } = item || {};

  const getStatus = useCallback(
    (startAt, endAt) => {
      if (status === POOL_STATUS.NOT_START) {
        // 项目未开始，pool一定未开始
        return POOL_STATUS.NOT_START;
      } else if (status === POOL_STATUS.COMPLETED) {
        // 项目已结束，pool一定已结束
        return POOL_STATUS.COMPLETED;
      } else if (moment().isBefore(startAt)) {
        return POOL_STATUS.NOT_START;
      } else if (moment().isAfter(endAt)) {
        return POOL_STATUS.COMPLETED;
      }
      return POOL_STATUS.IN_PROCESS;
    },
    [status],
  );

  const isShowTask = useMemo(() => {
    return !!openBonusTask && !userBonusTaskFinish;
  }, [openBonusTask, userBonusTaskFinish]);

  const days = useMemo(() => {
    return !stakingEndTime || !stakingStartTime
      ? '0'
      : Math.ceil((stakingEndTime - stakingStartTime) / dayMilSecondNum) || '0';
  }, [stakingStartTime, stakingEndTime]);

  const CardList = useMemo(() => {
    const content = (mini = false) =>
      map(pools, (item, index) => {
        return (
          <PoolCard
            {...item}
            qoute={earnTokenName}
            qouteIconUrl={earnTokenLogo}
            status={status}
            key={item?.poolId}
            mini={mini}
            isShowTask={isShowTask}
            userBonusCoefficient={userBonusCoefficient}
            campaignId={campaignId}
            earnTokenName={earnTokenName}
            poolStatus={getStatus(item?.stakingStartTime, item?.stakingEndTime)}
          />
        );
      });
    if (!sm) {
      return <ColoumnWrapper>{content()}</ColoumnWrapper>;
    } else if (pools?.length < 3 || !lg) {
      return <TwoColoumnWrapper>{content(!lg)}</TwoColoumnWrapper>;
    } else {
      return <ThreeColoumnWrapper>{content(true)}</ThreeColoumnWrapper>;
    }
  }, [
    sm,
    lg,
    pools,
    earnTokenName,
    earnTokenLogo,
    status,
    isShowTask,
    userBonusCoefficient,
    campaignId,
    getStatus,
  ]);

  const handleLocateTo = useCallback(() => {
    trackClick(['ProjectName', 'gempoolCurrencyDetails'], {
      currency: earnTokenName,
    });
    locateToUrlInApp(`/gempool/${earnTokenName}`);
  }, [earnTokenName]);

  return (
    <StyledProjectItem
      className={`${status} projectCard`}
      to={`/gempool/${earnTokenName}`}
      onClick={handleLocateTo}
      dontGoWithHref={isInApp}
    >
      <div className="bg" />
      <ActivityTag status={status} showTopCountdown={showTopCountdown} stakingEndTime={stakingEndTime} />

      {!sm ? (
        <>
          <H5ProjectInfoWrapper>
            <div className="currencyIntro">
              <LazyImg src={earnTokenLogo} alt="logo" />
              <span className="name">
                <span>{earnTokenName}</span>
                <AnnouncementContent announcementAddress={announcementAddress} />
              </span>
            </div>
            <div className="dataWrapper">
              {status === POOL_STATUS.NOT_START && (
                <div className="item">
                  <div className="label">
                    {_t('efa04c809a994000aaa3', {
                      time: `${dateTimeFormat({
                        date: stakingStartTime,
                        lang: currentLang,
                        options: { year: undefined, second: undefined, timeZone: 'UTC' },
                      })} (UTC)`,
                    })}
                  </div>
                  <div className="value">
                    <CountDownComp date={stakingStartTime} />
                  </div>
                </div>
              )}
              {status === POOL_STATUS.IN_PROCESS && (
                <div className="item">
                  <div className="label">
                    {_t('d8566170aff04000aab4', {
                      time: `${dateTimeFormat({
                        date: stakingEndTime,
                        lang: currentLang,
                        options: { year: undefined, second: undefined, timeZone: 'UTC' },
                      })} (UTC)`,
                    })}
                  </div>
                  <div className="value">
                    <CountDownComp date={stakingEndTime} />
                  </div>
                </div>
              )}
              {status === POOL_STATUS.COMPLETED && (
                <div className="item">
                  <div className="label">{_t('febbfb0a52d84000aed7')}</div>
                  <div className="value">
                    {stakingStartTime && stakingEndTime ? (
                      <div className="completedValue">
                        {`${dateTimeFormat({
                          date: stakingStartTime,
                          lang: currentLang,
                          options: { year: undefined, second: undefined, timeZone: 'UTC' },
                        })} ~ ${dateTimeFormat({
                          date: stakingEndTime,
                          lang: currentLang,
                          options: { year: undefined, second: undefined, timeZone: 'UTC' },
                        })} (UTC)`}
                      </div>
                    ) : (
                      '--'
                    )}
                  </div>
                </div>
              )}
              <div className="item">
                <div className="label">
                  {_t('59db786bbb9b4000a2ce', { currency: earnTokenName })}
                </div>
                <div className="value">
                  {<NumFormatComp value={totalReturns} />}
                  <span className="utc">{earnTokenName}</span>
                </div>
              </div>
              <div className="item">
                <div className="label">{_t('24c4a59b9fa44000a1b5')}</div>
                <div className="value">{_t('d7d30ec744ff4000a2af', { day: days })}</div>
              </div>
            </div>
          </H5ProjectInfoWrapper>
        </>
      ) : (
        <ProjectInfoWrapper>
          <CurrencyInfoWrapper>
            <LazyImg src={earnTokenLogo} alt="logo" />
            <div className="currencyIntro">
              <div className="nameWrapper">
                <span className="name">
                  <span>{earnTokenName}</span>
                  <AnnouncementContent announcementAddress={announcementAddress} />
                </span>
              </div>
              <div className="desc">{earnTokenOverview}</div>
            </div>
          </CurrencyInfoWrapper>
          <ProjectDataWrapper>
            <div className="item">
              <div className="value">{<NumFormatComp value={totalReturns} />}</div>
              <div className="label">{_t('59db786bbb9b4000a2ce', { currency: earnTokenName })}</div>
            </div>
            <div className="item">
              <div className="value">{_t('d7d30ec744ff4000a2af', { day: days })}</div>
              <div className="label">{_t('24c4a59b9fa44000a1b5')}</div>
            </div>
            {status === POOL_STATUS.NOT_START && (
              <div className="item">
                <div className="value">
                  <CountDownComp date={stakingStartTime} />
                </div>
                <div className="label">
                  {_t('efa04c809a994000aaa3', {
                    time: `${dateTimeFormat({
                      date: stakingStartTime,
                      lang: currentLang,
                      options: { year: undefined, second: undefined, timeZone: 'UTC' },
                    })} (UTC)`,
                  })}
                </div>
              </div>
            )}
            {status === POOL_STATUS.IN_PROCESS && !showTopCountdown ? (
              <div className="item">
                <div className="value">
                  <CountDownComp date={stakingEndTime} />
                </div>
                <div className="label">
                  {_t('d8566170aff04000aab4', {
                    time: `${dateTimeFormat({
                      date: stakingEndTime,
                      lang: currentLang,
                      options: { year: undefined, second: undefined, timeZone: 'UTC' },
                    })} (UTC)`,
                  })}
                </div>
              </div>
            ) : null}
            {status === POOL_STATUS.COMPLETED && (
              <div className="item">
                <div className="value">
                  {stakingStartTime && stakingEndTime ? (
                    <div className="completedValue">
                      {`${dateTimeFormat({
                        date: stakingStartTime,
                        lang: currentLang,
                        options: { year: undefined, second: undefined, timeZone: 'UTC' },
                      })} ~ ${dateTimeFormat({
                        date: stakingEndTime,
                        lang: currentLang,
                        options: { year: undefined, second: undefined, timeZone: 'UTC' },
                      })} (UTC)`}
                    </div>
                  ) : (
                    '--'
                  )}
                </div>
                <div className="label">{_t('febbfb0a52d84000aed7')}</div>
              </div>
            )}
          </ProjectDataWrapper>
        </ProjectInfoWrapper>
      )}

      {status !== POOL_STATUS.COMPLETED && isShowTask && !!user && (
        <EntranceComp campaignId={campaignId} />
      )}

      {status === POOL_STATUS.NOT_START && (
        <AlertWrapper>
          <Alert showIcon type="warning" title={_t('36c9d9efed014000a8d7')} />
        </AlertWrapper>
      )}

      <PoolListWrapper>{CardList}</PoolListWrapper>
    </StyledProjectItem>
  );
}
