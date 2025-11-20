/**
 * Owner: jessie@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { ICArrowRight2Outlined } from '@kux/icons';
import { Button, Divider, NumberFormat, useResponsive } from '@kux/mui';
import { numberFormat } from '@kux/mui/utils';
import { useCountDown } from 'ahooks';
import { memo, useCallback, useMemo, useEffect } from 'react';
import { useDispatch, shallowEqual } from 'react-redux';
import { pullVaildStatus } from 'services/gempool';
import LazyImg from 'src/components/common/LazyImg';
import { useSelector } from 'src/hooks/useSelector';
import tipBgIcon from 'static/gempool/staking_tip_bg.svg';
import { ReactComponent as DoubleArrowIcon } from 'static/gempool/doubleArrow.svg';
import { ReactComponent as H5CircleIcon } from 'static/gempool/h5Circle.svg';
import logo3 from 'static/gempool/giftbox.svg';
import { ReactComponent as PadCircleIcon } from 'static/gempool/padCircle.svg';
import { ReactComponent as TimeIcon } from 'static/gempool/time.svg';
import { ReactComponent as UserIcon } from 'static/gempool/user.svg';
import { ReactComponent as WebCircleIcon } from 'static/gempool/webCircle.svg';
import { _t, _tHTML } from 'tools/i18n';
import {
  skip2Login,
  transformNumberPrecision,
  transformTimeStr,
} from 'TradeActivity/utils';
import Tooltip from '../../../ActivityCommon/Tooltip';
import { POOL_STATUS, POOL_TAG_TEXT } from '../../config';
import AssetsComp from './AssetsComp';
import NumFormatComp from './NumFormatComp';
import { Apr } from './Apr';
import {
  CountDownWarpper,
  H5PoolButtonWrapper,
  H5PoolDataWrapper,
  H5PoolHeaderWrapper,
  H5PoolInfoWrapper,
  H5PoolTag,
  PlaceholderWrapper,
  PoolButtonWrapper,
  PoolDataWrapper,
  PoolInfoWrapper,
  PoolTag,
  RateWarpper,
  StyledH5PoolCard,
  StyledPoolCard,
  SymbolGroupWarpper,
  SymbolWarpper,
  TaskEntranceWrapper,
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

export const EntranceComp = memo(({ campaignId }) => {
  const dispatch = useDispatch();
  const { currentLang } = useLocale();

  const handleTaskModal = useCallback(
    (e) => {
      e.preventDefault && e.preventDefault();
      e.stopPropagation && e.stopPropagation();

      dispatch({
        type: 'gempool/updateCampaignExtra',
        payload: {
          campaignId,
        },
      });

      dispatch({
        type: 'gempool/update',
        payload: {
          taskModal: true,
          questionId: campaignId,
        },
      });
    },
    [dispatch, campaignId],
  );

  useEffect(() => {
    if (!campaignId) return;
    dispatch({
      type: 'gempool/pullGemPoolBonusTask',
      payload: {
        id: campaignId,
      },
      fullData: true,
    });
  }, [campaignId, dispatch]);

  const taskMap = useSelector(state => state.gempool.tasksMap, shallowEqual) || {};
  const {
    userBonusCoefficient: taskUserBonusCoefficient,
    maxBonusCoefficient: taskMaxBonusCoefficient,
  } = taskMap[campaignId] || {};


  return (
    <TaskEntranceWrapper onClick={handleTaskModal}>
      <img className='tipBgIcon' src={tipBgIcon} alt='tipBgIcon' />
      <LazyImg src={logo3} alt="gift" />
      <div className='wrapper'>
        <div className="desc">
          {_tHTML('f78a20209ff44800a527', {
            current: taskUserBonusCoefficient ? numberFormat({
              number: taskUserBonusCoefficient,
              lang: currentLang,
              options: {
                style: 'percent',
              },
            }): '--',
            max: taskMaxBonusCoefficient ? numberFormat({
              number: taskMaxBonusCoefficient,
              lang: currentLang,
              options: {
                style: 'percent',
              },
            }) : '--',
          })}
        </div>
        <span className='btnGroup'>
          {_t('8d90347b5e054800a078')}
          <ICArrowRight2Outlined />
        </span>
      </div>
    </TaskEntranceWrapper>
  );
});

const RateComp = memo(({ value, isShowTask, campaignId, stakingAmountTotal }) => {
  const { currentLang } = useLocale();
  const dispatch = useDispatch();
  const handleTaskModal = useCallback(
    (e) => {
      e.preventDefault && e.preventDefault();
      e.stopPropagation && e.stopPropagation();

      dispatch({
      type: 'gempool/updateCampaignExtra',
      payload: {
        campaignId,
      },
    });
      dispatch({
        type: 'gempool/update',
        payload: {
          taskModal: true,
          questionId: campaignId,
        },
      });
    },
    [dispatch, campaignId],
  );
  return (
    <Tooltip
      title={
        <>
          <span>
            {_t('f07c88cac0eb4000a9a2', {
              percent: numberFormat({
                number: value,
                lang: currentLang,
                options: {
                  style: 'percent',
                  maximumFractionDigits: 2,
                },
              }),
            })}
          </span>
          {isShowTask && (
            <Button type="brandGreen" variant="text" onClick={handleTaskModal}>
              {_t('61693121e7694000a7cb')}
            </Button>
          )}
        </>
      }
    >
      <RateWarpper className={+stakingAmountTotal > 0 ? 'activeRate' : ''}>
        <DoubleArrowIcon />
        <NumberFormat
          options={{
            style: 'percent',
            maximumFractionDigits: 2,
          }}
          lang={currentLang}
        >
          {value}
        </NumberFormat>
      </RateWarpper>
    </Tooltip>
  );
});

const CountDownComp = memo(({ date, currency, showTag, className = '' }) => {
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
    <CountDownWarpper className={`coutdown ${className}`} onClick={handleClick}>
      <TimeIcon />
      <Tooltip title={_t('9f2bbf1086ee4000aacb', { currency })}>
        {
          showTag ? (
            <span className='timeTag'>
              <span className="unit">{transformTimeStr(days)}</span><span className="dot">:</span>
              <span className="unit">{transformTimeStr(hours)}</span><span className="dot">:</span>
              <span className="unit">{transformTimeStr(minutes)}</span><span className="dot">:</span>
              <span className="unit">{transformTimeStr(seconds)}</span>
            </span>
          ) : (
            <span className="time">
              {_t('8498aca6a1f44000afee', {
                day: days,
                hour: transformTimeStr(hours),
                minute: transformTimeStr(minutes),
                second: transformTimeStr(seconds),
              })}
            </span>
          )
        }
      </Tooltip>
    </CountDownWarpper>
  );
});

const SymbolGroupComp = memo(({ iconUrl, qouteIconUrl, value, currency, stakingAmountTotal }) => {
  const dispatch = useDispatch();
  const { currentLang } = useLocale();
  const { sm, lg } = useResponsive();

  const CircleIcon = useMemo(() => {
    if (lg) {
      return <WebCircleIcon className="circle" />;
    } else if (!sm) {
      return <H5CircleIcon className="circle" />;
    }
    return <PadCircleIcon className="circle" />;
  }, [sm, lg]);

  // 阻止点击默认事件
  const handleClick = useCallback((e) => {
    if (!e) return;
    e.preventDefault && e.preventDefault();
    e.stopPropagation && e.stopPropagation();
  }, []);

  const hasUnCliamed = +value > 0;
  const hasPooled = +stakingAmountTotal > 0;

  // 无奖励可领取时增加弹窗提醒
  const handleLogoClick = (e) => {
    if (!hasPooled) return;
    handleClick(e);
    // 没奖励，显示提示弹窗
    if (!hasUnCliamed) {
      dispatch({
        type: 'gempool/update',
        payload: {
          openCliamEmptyTip: true,
        }
      })
    } else {
      // 有奖励，显示领奖弹窗
      dispatch({
        type: 'gempool/update',
        payload: {
          rewardsModal: true,
        },
      });
    }
  }
  return (
    <SymbolGroupWarpper
      className={hasPooled ? 'activeSymbolGroup' : ''}
      onClick={handleLogoClick}
    >
      <div className="logoGroup">
        <LazyImg src={iconUrl} alt="logo" />
        <LazyImg src={qouteIconUrl} alt="logo" className="outer" />
      </div>

      {hasPooled && CircleIcon}
      {hasUnCliamed ? (
        <Tooltip
          title={_t('6fb8d6e997c24000a573', {
            num: numberFormat({
              number: value,
              lang: currentLang,
            }),
            currency,
          })}
        >
          <span className="value" role="button" tabIndex="0" onClick={handleClick}>
            <NumberFormat lang={currentLang} isPositive={true}>
              {value}
            </NumberFormat>
            <span className="unit"> {currency}</span>
          </span>
        </Tooltip>
      ) : null}
    </SymbolGroupWarpper>
  );
});

const ButtonComp = memo(
  ({
    poolStatus,
    stakingTokenLogo,
    stakingToken,
    poolId,
    minStakingAmount,
    campaignId,
    status,
    earnTokenName,
    tokenScale,
    specificType,
    jumpLink,
  }) => {
    const dispatch = useDispatch();
    const isLogin = useSelector((state) => state.user.isLogin);

    const handleStake = useCallback(
      async (e) => {
        e.preventDefault && e.preventDefault();
        e.stopPropagation && e.stopPropagation();

        // 优先判断登录
        if (!isLogin) {
          skip2Login();
          return;
        }

        // 新用户专享活动 判断用户是否支持
        if (specificType) {
          const res = await pullVaildStatus(poolId);
          if (res && res.success && !res.data) {
            dispatch({
              type: 'gempool/update',
              payload: {
                statusModalVisible: true,
                statusModalJumpLink: jumpLink,
              },
            });
            return;
          }
        }

        dispatch({
          type: 'gempool/switchCampaign',
          payload: {
            stakeModal: true,
            poolInfo: {
              stakingTokenLogo,
              stakingToken,
              poolId,
              minStakingAmount,
              campaignId,
              status,
              earnTokenName,
              tokenScale,
            },
          },
        });
      },
      [
        jumpLink,
        isLogin,
        dispatch,
        stakingTokenLogo,
        stakingToken,
        poolId,
        minStakingAmount,
        campaignId,
        status,
        earnTokenName,
        tokenScale,
        specificType,
      ],
    );

    const buttonComp = useMemo(() => {
      if (poolStatus === POOL_STATUS.COMPLETED) {
        return (
          <Button fullWidth disabled={true}>
            {_t('9a8580a0f8e54000a8c3')}
          </Button>
        );
      }
      return (
        <Button fullWidth onClick={handleStake}>
          {isLogin ? _t('dfdce9d75b6b4000a782') : _t('login')}
        </Button>
      );
    }, [poolStatus, handleStake, isLogin]);

    return buttonComp;
  },
);


export default function PoolCard(props) {
  const {
    campaignId,
    stakingTokenLogo,
    stakingToken,
    qoute,
    qouteIconUrl,
    mini,
    totalStakingParticipants,
    earnTokenAmount,
    totalStakingAmount,
    userBonusCoefficient,
    status, // 仅区分项目是否结束
    stakingEndTime,
    isShowTask,
    poolId,
    myStakingInfo = {},
    poolStatus,
    tokenScale,
    specificType,
    annualPercentageRate,
    presetStatus,
  } = props;
  const { sm } = useResponsive();

  const { stakingAmountTotal, claimedRewards, unclaimedRewards } = myStakingInfo || {};
  const key = poolId;
  const isSm = !sm;

  const isLogin = useSelector((state) => state.user.isLogin);

  const isEnd = status === POOL_STATUS.COMPLETED;

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

  const poolTagText = POOL_TAG_TEXT[specificType];

  if (isSm) {
    return (
      <StyledH5PoolCard key={key} className={specificType ? 'withTag' : ''}>
        {poolTagText && <H5PoolTag>{poolTagText()}</H5PoolTag>}
        <div className="container">
          {status === POOL_STATUS.COMPLETED ? (
            <H5PoolHeaderWrapper>
              <SymbolComp
                iconUrl={stakingTokenLogo}
                name={_t('6c7d61047a164000a18b', { currency: stakingToken })}
              />
              {userComp}
            </H5PoolHeaderWrapper>
          ) : (
            <H5PoolInfoWrapper>
              <div className="left">
                <SymbolComp
                  iconUrl={stakingTokenLogo}
                  name={_t('6c7d61047a164000a18b', { currency: stakingToken })}
                />
                <div className="dataWrapper">
                  {userComp}
                  {status === POOL_STATUS.IN_PROCESS ? (
                    poolStatus !== POOL_STATUS.NOT_START ? (
                      <CountDownComp date={stakingEndTime} currency={stakingToken} className="newCountdown" />
                    ) : (
                      <span className="markText">{_t('6333cacabda24000a67f')}</span>
                    )
                  ) : null}
                </div>
              </div>
              <div className="right">
                <SymbolGroupComp
                  iconUrl={stakingTokenLogo}
                  qouteIconUrl={qouteIconUrl}
                  value={unclaimedRewards}
                  stakingAmountTotal={stakingAmountTotal}
                  currency={qoute}
                />
              </div>
            </H5PoolInfoWrapper>
          )}

          <H5PoolDataWrapper>
            <div className="item">
              <div className="label">{_t('832f91dc3c894000a2bf', { currency: qoute })}</div>
              <div className="value">
                <NumFormatComp value={earnTokenAmount} />
              </div>
            </div>
            <Apr className='item' apr={annualPercentageRate} isEnd={isEnd} presetStatus={presetStatus} />
            <div className="item">
              <div className="label">{_t('2b66321bf9cd4000a482', { currency: stakingToken })}</div>
              <div className="value">
                <NumFormatComp value={transformNumberPrecision(totalStakingAmount)} />
              </div>
            </div>
            {status !== POOL_STATUS.COMPLETED && (
              <div className="item">
                <div className="label">
                  {_t('8f26ebc5a5274000ae24', { currency: stakingToken })}
                </div>
                <div className="value">
                  {isLogin ? (
                    <NumFormatComp value={stakingAmountTotal} />
                  ) : (
                    <PlaceholderWrapper>--</PlaceholderWrapper>
                  )}

                  {poolStatus === POOL_STATUS.IN_PROCESS && !!+userBonusCoefficient && isLogin ? (
                    <RateComp
                      value={userBonusCoefficient}
                      isShowTask={isShowTask}
                      campaignId={campaignId}
                      stakingAmountTotal={stakingAmountTotal}
                    />
                  ) : null}
                </div>
              </div>
            )}
          </H5PoolDataWrapper>


          {status !== POOL_STATUS.COMPLETED && (
            <H5PoolButtonWrapper>
              <ButtonComp {...props} />
            </H5PoolButtonWrapper>
          )}
        </div>
      </StyledH5PoolCard>
    );
  }

  return (
    <StyledPoolCard className={` ${mini ? 'mini' : ''} ${status}`} key={key}>
      {poolTagText && <PoolTag>{poolTagText()}</PoolTag>}

      <div>
        <PoolInfoWrapper>
          <div className="left">
            <SymbolComp
              iconUrl={stakingTokenLogo}
              name={_t('6c7d61047a164000a18b', { currency: stakingToken })}
            />
            <div className="symbolDesc">
              {_t('fcee8d76d1604000a295', { base: stakingToken, qoute })}
            </div>
            <div className={`dataWrapper ${mini ? 'miniDataWrapper' : ''}`}>
              {userComp}
              {status === POOL_STATUS.IN_PROCESS ? (
                <>
                  {!mini && <Divider type="vertical" />}
                  {poolStatus !== POOL_STATUS.NOT_START ? (
                    <CountDownComp date={stakingEndTime} currency={stakingToken} showTag />
                  ) : (
                    <span className="markText">{_t('6333cacabda24000a67f')}</span>
                  )}
                </>
              ) : null}
            </div>
          </div>
          <div className="right">
            <SymbolGroupComp
              iconUrl={stakingTokenLogo}
              qouteIconUrl={qouteIconUrl}
              value={unclaimedRewards}
              stakingAmountTotal={stakingAmountTotal}
              currency={qoute}
            />
          </div>
        </PoolInfoWrapper>
        <PoolDataWrapper>
          <div className="itemWrapper column">
            <div className="item">
              <div className="label">{_t('832f91dc3c894000a2bf', { currency: qoute })}</div>
              <div className="value">
                <NumFormatComp value={earnTokenAmount} />
              </div>
            </div>
            <Apr className='item' apr={annualPercentageRate} isEnd={isEnd} presetStatus={presetStatus} />
            <div className="item">
              <div className="label">{_t('2b66321bf9cd4000a482', { currency: stakingToken })}</div>
              <div className="value">
                <NumFormatComp value={transformNumberPrecision(totalStakingAmount)} />
              </div>
            </div>
          </div>
          {status !== POOL_STATUS.COMPLETED && (
            <>
              <div className='divider' />
              <div className="itemWrapper">
                <div className="item">
                  <div className="label">
                    {_t('8f26ebc5a5274000ae24', { currency: stakingToken })}
                  </div>
                  <div className={`value ${isLogin ? 'fixCount' : ''}`}>
                    {isLogin ? (
                      <NumFormatComp value={stakingAmountTotal} />
                    ) : (
                      <PlaceholderWrapper>--</PlaceholderWrapper>
                    )}

                    {poolStatus === POOL_STATUS.IN_PROCESS && !!+userBonusCoefficient && isLogin ? (
                      <RateComp
                        value={userBonusCoefficient}
                        campaignId={campaignId}
                        isShowTask={isShowTask}
                        stakingAmountTotal={stakingAmountTotal}
                      />
                    ) : null}
                  </div>
                </div>
                <div className="item">
                  <div className="label">{_t('1bfd24ccafae4000ab5e', { currency: qoute })}</div>
                  <div className="value">
                    {isLogin && poolStatus !== POOL_STATUS.NOT_START ? (
                      <NumFormatComp value={claimedRewards} />
                    ) : (
                      <PlaceholderWrapper>--</PlaceholderWrapper>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </PoolDataWrapper>
      </div>

      <div>

        {status !== POOL_STATUS.COMPLETED && (
          <PoolButtonWrapper>
            {isLogin && (
              <div className="assets">
                <AssetsComp
                  stakingToken={stakingToken}
                  tokenScale={tokenScale}
                  isMini={mini}
                  isTotal={stakingToken === 'KCS'}
                />
              </div>
            )}
            <ButtonComp {...props} />
          </PoolButtonWrapper>
        )}
      </div>
    </StyledPoolCard>
  );
}
