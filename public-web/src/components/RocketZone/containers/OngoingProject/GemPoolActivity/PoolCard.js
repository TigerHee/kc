/**
 * Owner: jessie@kupotech.com
 */
import { Button, Divider, useResponsive } from '@kux/mui';
import { useCountDown } from 'ahooks';
import AnimateButton from 'components/RocketZone/components/AnimateButton';
import moment from 'moment';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import LazyImg from 'src/components/common/LazyImg';
import { ReactComponent as TimeIcon } from 'static/gempool/time.svg';
import { ReactComponent as UserIcon } from 'static/gempool/user.svg';
import { _t } from 'tools/i18n';
import { POOL_STATUS } from 'TradeActivity/GemPool/config';
import { locateToUrl, transformNumberPrecision, transformTimeStr } from 'TradeActivity/utils';
import Tooltip from 'TradeActivityCommon/Tooltip';
import { Apr } from 'src/components/TradeActivity/GemPool/containers/ProjectItem/Apr';
import NumFormatComp from './NumFormatComp';
import {
  CountDownWarpper,
  PoolButtonWrapper,
  PoolDataWrapper,
  PoolInfoWrapper,
  StyledPoolCard,
  SymbolGroupWarpper,
  SymbolWarpper,
  UserNumberWarpper,
} from './styledComponents';

const SymbolComp = memo(({ iconUrl, name }) => {
  return (
    <SymbolWarpper>
      <LazyImg src={iconUrl} alt="logo" />
      <span>{name}</span>
    </SymbolWarpper>
  );
});

const CountDownComp = memo(({ date, currency }) => {
  const dispatch = useDispatch();
  const handleDataList = useCallback(() => {
    dispatch({
      type: 'gempool/pullGemPoolRecords',
    });
  }, [dispatch]);

  // 阻止点击默认事件
  const handleClick = useCallback((e) => {
    e.preventDefault && e.preventDefault();
    e.stopPropagation && e.stopPropagation();
  }, []);

  const [__, formattedRes] = useCountDown({
    targetDate: date,
    onEnd: handleDataList,
    interval: 1000,
  });

  const { days, hours, minutes, seconds } = formattedRes;

  return (
    <CountDownWarpper className="coutdown" onClick={handleClick}>
      <TimeIcon />
      <Tooltip title={_t('9f2bbf1086ee4000aacb', { currency })}>
        <span className="time">
          {_t('8498aca6a1f44000afee', {
            day: days,
            hour: transformTimeStr(hours),
            minute: transformTimeStr(minutes),
            second: transformTimeStr(seconds),
          })}
        </span>
      </Tooltip>
    </CountDownWarpper>
  );
});

const SymbolGroupComp = memo(({ iconUrl, qouteIconUrl }) => {
  return (
    <SymbolGroupWarpper>
      <LazyImg src={iconUrl} alt="logo" />
      <LazyImg src={qouteIconUrl} alt="logo" className="outer" />
    </SymbolGroupWarpper>
  );
});

const ButtonComp = memo(({ status, url, stakingToken }) => {
  const dispatch = useDispatch();
  const buttonComp = useMemo(() => {
    if (status !== 1) {
      return (
        <Button
          variant="outlined"
          fullWidth
          onClick={() => {
            locateToUrl(url);
          }}
        >
          {_t('pKkEvKAzGPcTbthrw7ypWu')}
        </Button>
      );
    }
    return (
      <AnimateButton
        fullWidth
        onClick={() => {
          dispatch({ type: 'gempool/update', payload: { activeStakingToken: stakingToken } });
          locateToUrl(url);
        }}
      >
        {_t('371e1a74535c4000ad95')}
      </AnimateButton>
    );
  }, [status, url, stakingToken, dispatch]);

  return buttonComp;
});

export default function PoolCard(props) {
  const {
    status, // 仅区分项目是否结束
    key,
    stakingEndTime,
    stakingStartTime,
    qoute,
    qouteIconUrl,
    totalStakingParticipants,
    earnTokenAmount,
    totalStakingAmount,
    stakingTokenLogo,
    stakingToken,
    url,
    annualPercentageRate,
    presetStatus,
  } = props;
  const { sm, lg } = useResponsive();
  const [poolStatus, setPoolStatus] = useState(0);
  const timeRef = useRef();

  const isEnd = poolStatus === POOL_STATUS.COMPLETED;

  const getStatus = useCallback(() => {
    if (status === 0) {
      // 项目未开始，pool一定未开始
      return POOL_STATUS.NOT_START;
    } else if (status === 2) {
      // 项目已结束，pool一定已结束
      return POOL_STATUS.COMPLETED;
    } else if (moment().isBefore(stakingStartTime)) {
      return POOL_STATUS.NOT_START;
    } else if (moment().isAfter(stakingEndTime)) {
      return POOL_STATUS.COMPLETED;
    }
    return POOL_STATUS.IN_PROCESS;
  }, [status, stakingStartTime, stakingEndTime]);

  useEffect(() => {
    setPoolStatus(getStatus());

    if (timeRef.current) {
      clearInterval(timeRef.current);
    }

    if (status !== 2) {
      timeRef.current = setInterval(() => {
        setPoolStatus(getStatus());
      }, 1000);

      return () => {
        if (timeRef.current) {
          clearInterval(timeRef.current);
        }
      };
    }
  }, [status, getStatus]);

  const userComp = useMemo(() => {
    return (
      <UserNumberWarpper className="user">
        <UserIcon />
        <span className="num">
          <NumFormatComp value={totalStakingParticipants} />
        </span>
      </UserNumberWarpper>
    );
  }, [totalStakingParticipants]);

  return (
    <StyledPoolCard key={key}>
      <PoolInfoWrapper>
        <div className="left">
          <SymbolComp
            iconUrl={stakingTokenLogo}
            name={_t('6c7d61047a164000a18b', { currency: stakingToken })}
          />
          {sm && (
            <div className="symbolDesc">
              {_t('fcee8d76d1604000a295', { base: stakingToken, qoute })}
            </div>
          )}

          <div className="dataWrapper">
            {userComp}
            {/* 池子进行中显示倒计时 */}
            {status === 1 ? (
              <>
                {lg && <Divider type="vertical" />}
                {poolStatus === POOL_STATUS.IN_PROCESS && (
                  <CountDownComp date={stakingEndTime} currency={stakingToken} />
                )}
                {poolStatus === POOL_STATUS.NOT_START && (
                  <span className="markText">{_t('6333cacabda24000a67f')}</span>
                )}
              </>
            ) : null}
          </div>
        </div>
        <div className="right">
          <SymbolGroupComp iconUrl={stakingTokenLogo} qouteIconUrl={qouteIconUrl} />
        </div>
      </PoolInfoWrapper>
      <div>
        <PoolDataWrapper>
          <div className="itemWrapper column">
            <div className="item">
              <div className="label">{_t('832f91dc3c894000a2bf', { currency: qoute })}</div>
              <div className="value">
                <NumFormatComp value={earnTokenAmount} />
              </div>
            </div>
            <Apr apr={annualPercentageRate} isEnd={isEnd} className='item' presetStatus={presetStatus} />
            <div className="item">
              <div className="label">{_t('2b66321bf9cd4000a482', { currency: stakingToken })}</div>
              <div className="value">
                <NumFormatComp value={transformNumberPrecision(totalStakingAmount)} />
              </div>
            </div>
          </div>
        </PoolDataWrapper>

        <PoolButtonWrapper>
          <ButtonComp url={url} status={status} stakingToken={stakingToken} />
        </PoolButtonWrapper>
      </div>
    </StyledPoolCard>
  );
}
