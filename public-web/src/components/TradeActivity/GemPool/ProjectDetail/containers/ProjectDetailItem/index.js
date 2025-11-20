/**
 * Owner: jessie@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useLocale } from '@kucoin-base/i18n';
import { ICArrowRight2Outlined, ICArrowRightOutlined } from '@kux/icons';
import { Button, DateTimeFormat, Divider, useResponsive, useSnackbar } from '@kux/mui';
import { Link } from 'components/Router';
import { memo, useCallback, useEffect, useState } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { pullEnableSymbol, pullVaildStatus } from 'services/gempool';
import LazyImg from 'src/components/common/LazyImg';
import { useSelector } from 'src/hooks/useSelector';
import coinLogo from 'static/gempool/coin.svg';
import coinLogoDark from 'static/gempool/coinDark.svg';
import tipBgIcon from 'static/gempool/staking_tip_bg.svg';
import { _t } from 'tools/i18n';
import AssetsComp from 'TradeActivity/GemPool/containers/ProjectItem/AssetsComp';
import NumFormatComp from 'TradeActivity/GemPool/containers/ProjectItem/NumFormatComp';
import { useStakingUrl } from 'TradeActivity/ActivityCommon/hooks';
import {
  locateToUrl,
  locateToUrlInApp,
  skip2Login,
  transformNumberPrecision,
} from 'TradeActivity/utils';
import StatusModal, { EnumStatus } from 'TradeActivityCommon/StatusModal';
import Tooltip from 'TradeActivityCommon/Tooltip';
import { trackClick } from 'utils/ga';
import { push } from 'utils/router';
import { POOL_STATUS, POOL_TAG_TEXT, REMARK_STATUS_TEXT } from '../../../config';
import RateComp from './RateComp';
import { Apr } from '../../../containers/ProjectItem/Apr';
import {
  CurrencyInfoWrapper,
  H5ClaimWarpper,
  H5PoolTag,
  H5ProjectDataWrapper,
  H5StakedWarpper,
  KCSTipWrapper,
  MoreWrapper,
  PlaceHolderText,
  PoolCommonInfoWrapper,
  PoolSelfInfoWrapper,
  PoolTag,
  ProjectDataWrapper,
  StyledH5PoolItem,
  StyledPoolItem,
} from './styledComponents';

const KCSTipComp = memo(({ status, stakingToken }) => {
  const isInApp = JsBridge.isApp();
  const currentTheme = useSelector((state) => state.setting.currentTheme);
  const stakingUrl = useStakingUrl();

  if (status === POOL_STATUS.COMPLETED || stakingToken !== 'KCS') {
    return null;
  }

  return (
    <KCSTipWrapper
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
    </KCSTipWrapper>
  );
});

function PoolCard(item) {
  const isInApp = JsBridge.isApp();
  const { sm, lg } = useResponsive();
  const { message } = useSnackbar();
  const { currentLang } = useLocale();
  const dispatch = useDispatch();
  const [enableSymbol, setEnableSymbol] = useState();
  const [vaildVisible, setVaildVisible] = useState(false);

  const user = useSelector((state) => state.user.user, shallowEqual);
  const loading = useSelector(
    (state) => state.loading.effects['gempool/postGemPoolRewardByPoolId'],
  );

  const {
    earnTokenName,
    earnTokenLogo,
    earnTokenAmount,
    maximumDailyRewards,
    stakingTokenLogo,
    stakingToken,
    stakingStartTime,
    stakingEndTime,
    totalStakingParticipants,
    totalStakingAmount,
    myStakingInfo,
    userBonusCoefficient,
    minStakingAmount,
    tokenScale,
    status,
    specificType,
    campaignId,
    poolId,
    jumpLink,
    projectStatus,
    annualPercentageRate,
    presetStatus,
  } = item || {};

  const { stakingAmount, stakingEarnAmount, stakingAmountTotal, claimedRewards, unclaimedRewards } =
    myStakingInfo || {};
  const poolTagText = POOL_TAG_TEXT[specificType];

  const isEnd = status === POOL_STATUS.COMPLETED;

  const handleSymbolInfoModal = useCallback(() => {
    dispatch({
      type: 'gempool/switchCampaign',
      payload: {
        symbolInfoModal: true,
        poolInfo: {
          earnTokenName,
          earnTokenAmount,
          maximumDailyRewards,
          stakingTokenLogo,
          stakingToken,
          stakingStartTime,
          stakingEndTime,
          totalStakingParticipants,
          totalStakingAmount,
          status,
          tokenScale,
          annualPercentageRate,
          presetStatus,
        },
      },
    });
  }, [
    dispatch,
    earnTokenName,
    earnTokenAmount,
    stakingTokenLogo,
    stakingToken,
    stakingStartTime,
    stakingEndTime,
    totalStakingParticipants,
    totalStakingAmount,
    status,
    maximumDailyRewards,
    tokenScale,
    annualPercentageRate,
    presetStatus,
  ]);

  const handleClaim = useCallback(() => {
    trackClick(['ProjectDetail', 'gempoolReceiveaward'], {
      amount: unclaimedRewards,
      currency: earnTokenName,
    });
    dispatch({
      type: 'gempool/postGemPoolRewardByPoolId',
      payload: {
        id: poolId,
      },
    }).then((res) => {
      if (res) {
        message.success(_t('2e68b5750b804000a958'));
      }
    });
  }, [message, dispatch, poolId, earnTokenName, unclaimedRewards]);

  const handleStake = useCallback(async () => {
    // 优先判断登录
    if (!user) {
      skip2Login();
      return;
    }

    // 新用户专享活动 判断用户是否支持
    if (specificType) {
      const res = await pullVaildStatus(poolId);
      if (res && res.success && !res.data) {
        setVaildVisible(true);
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
  }, [
    user,
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
  ]);

  const handleUnstake = useCallback(() => {
    // 优先判断登录
    if (!user) {
      skip2Login();
      return;
    }

    dispatch({
      type: 'gempool/switchCampaign',
      payload: {
        unstakeModal: true,
        poolInfo: {
          stakingTokenLogo,
          stakingToken,
          poolId,
          tokenScale,
          campaignId,
          stakingAmount,
          stakingEarnAmount,
          earnTokenName,
        },
      },
    });
  }, [
    user,
    dispatch,
    stakingTokenLogo,
    stakingToken,
    poolId,
    tokenScale,
    stakingAmount,
    stakingEarnAmount,
    campaignId,
    earnTokenName,
  ]);

  const handleToTradeBySymbol = useCallback(
    (e) => {
      e.preventDefault && e.preventDefault();
      e.stopPropagation && e.stopPropagation();

      if (isInApp) {
        // app内跳转
        JsBridge.open({
          type: 'jump',
          params: {
            url: `/trade?symbol=${enableSymbol}&goBackUrl=${encodeURIComponent(
              window.location.href,
            )}`,
          },
        });
      } else {
        push(`/trade/${enableSymbol}`);
      }
    },
    [isInApp, enableSymbol],
  );

  const handleEnableSymbol = useCallback(async (name) => {
    const res = await pullEnableSymbol(name);
    if (res?.success) {
      setEnableSymbol(res.data);
    }
  }, []);

  const handleStatusSubmit = useCallback(() => {
    if (jumpLink) {
      locateToUrl(jumpLink);
    }
  }, [jumpLink]);

  useEffect(() => {
    handleEnableSymbol(earnTokenName);
  }, [earnTokenName, handleEnableSymbol]);

  if (!sm) {
    return (
      <>
        {vaildVisible && (
          <StatusModal
            visible={vaildVisible}
            setDialogVisible={setVaildVisible}
            resultStatus={EnumStatus.Warning}
            contentTitle={_t('e8d40930604f4000ad7e')}
            contentText={_t('8f11ed838f484000afa9')}
            handleSubmit={handleStatusSubmit}
            okText={jumpLink ? _t('view') : _t('2e7e916fa6934000a923')}
            cancelText={jumpLink ? _t('back') : null}
          />
        )}
        <div className="kcsWrapper">
          <KCSTipComp status={projectStatus} stakingToken={stakingToken} />
        </div>
        <StyledH5PoolItem className={specificType ? 'withTag' : ''}>
          {poolTagText && <H5PoolTag>{poolTagText()}</H5PoolTag>}
          <div className="container">
            {!!REMARK_STATUS_TEXT[status] && (
              <div className={`${status} mark`}>{_t(REMARK_STATUS_TEXT[status])}</div>
            )}
            <CurrencyInfoWrapper>
              <LazyImg src={stakingTokenLogo} alt="logo" />
              <span className="name">{_t('6c7d61047a164000a18b', { currency: stakingToken })}</span>
            </CurrencyInfoWrapper>
            <H5StakedWarpper>
              <div className="dataWrapper">
                <div className="left">
                  <div className="item">
                    <div className="label">
                      {_t('8f26ebc5a5274000ae24', { currency: stakingToken })}
                    </div>
                    <div className="value">
                      <NumFormatComp value={stakingAmountTotal} />
                      {status === POOL_STATUS.IN_PROCESS && !!+userBonusCoefficient && !!user ? (
                        <RateComp value={userBonusCoefficient} />
                      ) : null}
                    </div>
                  </div>
                  {status !== POOL_STATUS.COMPLETED && !!user ? (
                    <div className="assetsWrapper">
                      <AssetsComp
                        isMini={!0}
                        isTotal={stakingToken === 'KCS'}
                        stakingToken={stakingToken}
                        tokenScale={tokenScale}
                      />
                    </div>
                  ) : null}
                </div>

                {status !== POOL_STATUS.COMPLETED && !!user ? (
                  <div className="right">
                    <Button
                      variant="text"
                      className="primary"
                      onClick={handleUnstake}
                      disabled={!+stakingAmountTotal}
                    >
                      {_t('64625b9b64b14000af99')}
                    </Button>
                  </div>
                ) : null}
              </div>

              {status === POOL_STATUS.COMPLETED ? (
                <div className="descWrapper">
                  {_t('195ad2151a004000a769', { currency: stakingToken })}
                </div>
              ) : (
                <div className="buttonWrapper">
                  <Button fullWidth onClick={handleStake}>
                    {!user ? _t('login') : _t('dfdce9d75b6b4000a782')}
                  </Button>
                </div>
              )}
            </H5StakedWarpper>
            <Divider />
            <H5ClaimWarpper>
              <div className="dataWrapper">
                <div className="left">
                  {status === POOL_STATUS.COMPLETED ? (
                    <div className="item endItem">
                      <div className="label">
                        {_t('d08217c3c8104000a3d4', { currency: earnTokenName })}
                      </div>
                      <div className="value">
                        <NumFormatComp value={claimedRewards} />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="item">
                        <Tooltip title={_t('e20c01836bdc4000a88a')}>
                          <div className="label underlineLabel">
                            {_t('42d507a50ab54000af9b', { currency: earnTokenName })}
                          </div>
                        </Tooltip>

                        <div className={`value ${+unclaimedRewards ? 'primary' : ''}`}>
                          <NumFormatComp
                            value={status === POOL_STATUS.NOT_START ? undefined : unclaimedRewards}
                          />
                        </div>
                      </div>
                      <div className="inlineItem">
                        <div className="label">
                          {_t('d8c1c4a187d74000aa44', { currency: earnTokenName })}
                        </div>
                        <div className="value">
                          <NumFormatComp
                            value={status === POOL_STATUS.NOT_START ? undefined : claimedRewards}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {status !== POOL_STATUS.COMPLETED && !!user && !enableSymbol ? (
                  <div className="right">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleClaim}
                      disabled={!+unclaimedRewards}
                      loading={loading}
                    >
                      {_t('d8d42c2099f44000a9e0')}
                    </Button>
                  </div>
                ) : null}
              </div>

              {status !== POOL_STATUS.COMPLETED && !!user && enableSymbol ? (
                <div className="buttonWrapper">
                  <Button onClick={handleToTradeBySymbol} type="default">
                    {_t('9f74506fd8214000a107')}
                  </Button>
                  <Button onClick={handleClaim} disabled={!+unclaimedRewards} loading={loading}>
                    {_t('d8d42c2099f44000a9e0')}
                  </Button>
                </div>
              ) : null}

              {status === POOL_STATUS.COMPLETED ? (
                <div className="descWrapper">
                  {_t('e954e76976134000a8e5', { currency: stakingToken })}

                  {enableSymbol ? (
                    <a href={`/trade/${enableSymbol}`} onClick={handleToTradeBySymbol}>
                      {_t('c053128b66434000a695')}
                    </a>
                  ) : null}
                </div>
              ) : null}
            </H5ClaimWarpper>
            <Divider />
            <H5ProjectDataWrapper>
              <div className="item">
                <div className="label">
                  {_t('bbc5676a4f584000a95f', { currency: stakingToken })}
                </div>
                <div className="value">
                  <NumFormatComp value={earnTokenAmount} />
                  <span className="unit">{earnTokenName}</span>
                </div>
              </div>
              <Apr className='item' apr={annualPercentageRate} isEnd={isEnd} inline={false} presetStatus={presetStatus} />
              <div className="item">
                <div className="label">
                  {_t('ef3eb1706ee44000a42c', { currency: stakingToken })}
                </div>
                <div className="value">
                  <NumFormatComp value={transformNumberPrecision(totalStakingAmount)} />
                  <span className="unit">{stakingToken}</span>
                </div>
              </div>
            </H5ProjectDataWrapper>
            <MoreWrapper>
              <span className="textWrapper" onClick={handleSymbolInfoModal}>
                {_t('57051de422614000a5f7')}
                <ICArrowRightOutlined />
              </span>
            </MoreWrapper>
          </div>
        </StyledH5PoolItem>
      </>
    );
  }

  return (
    <>
      {vaildVisible && (
        <StatusModal
          visible={vaildVisible}
          setDialogVisible={setVaildVisible}
          resultStatus={EnumStatus.Warning}
          contentTitle={_t('e8d40930604f4000ad7e')}
          contentText={_t('8f11ed838f484000afa9')}
          handleSubmit={handleStatusSubmit}
          okText={jumpLink ? _t('view') : _t('2e7e916fa6934000a923')}
          cancelText={jumpLink ? _t('back') : null}
        />
      )}
      <div className="kcsWrapper">
        <KCSTipComp status={projectStatus} stakingToken={stakingToken} />
      </div>
      <StyledPoolItem>
        {poolTagText && <PoolTag>{poolTagText()}</PoolTag>}
        {!!REMARK_STATUS_TEXT[status] && (
          <div className={`${status} mark`}>{_t(REMARK_STATUS_TEXT[status])}</div>
        )}

        <PoolCommonInfoWrapper>
          <CurrencyInfoWrapper>
            <LazyImg src={stakingTokenLogo} alt="logo" />
            <span className="name">{_t('6c7d61047a164000a18b', { currency: stakingToken })}</span>
          </CurrencyInfoWrapper>
          <ProjectDataWrapper>
            <div className="item">
              <div className="label">{_t('bbc5676a4f584000a95f', { currency: stakingToken })}</div>
              <div className="value">
                <NumFormatComp value={earnTokenAmount} />
                <span className="unit">{earnTokenName}</span>
              </div>
            </div>
            <div className="item">
              <div className="label">{_t('7588797493a14000a421')}</div>
              <div className="value">
                <LazyImg src={stakingTokenLogo} alt="logo" />
                <span className="name">{stakingToken}</span>
              </div>
            </div>
            <div className="item">
              <div className="label">{_t('b69c52fe138c4000aaf7')}</div>
              <div className="value">
                {stakingStartTime ? (
                  <DateTimeFormat
                    date={stakingStartTime}
                    lang={currentLang}
                    options={{ year: undefined, timeZone: 'UTC' }}
                  >
                    {stakingStartTime}
                  </DateTimeFormat>
                ) : (
                  <PlaceHolderText>--</PlaceHolderText>
                )}

                <span className="unit">(UTC)</span>
              </div>
            </div>
            <div className="item">
              <div className="label">{_t('3af78054c1a14000a273')}</div>
              <div className="value">
                {stakingEndTime ? (
                  <DateTimeFormat
                    date={stakingEndTime}
                    lang={currentLang}
                    options={{ year: undefined, timeZone: 'UTC' }}
                  >
                    {stakingEndTime}
                  </DateTimeFormat>
                ) : (
                  <PlaceHolderText>--</PlaceHolderText>
                )}

                <span className="unit">(UTC)</span>
              </div>
            </div>
            <div className="item">
              <div className="label">{_t('3e36a412f0134000ad6c', { currency: earnTokenName })}</div>
              <div className="value">
                {status !== POOL_STATUS.NOT_START ? (
                  <>
                    <NumFormatComp value={maximumDailyRewards} />
                    <span className="unit">{earnTokenName}</span>
                  </>
                ) : (
                  <PlaceHolderText>--</PlaceHolderText>
                )}
              </div>
            </div>
            <div className="item">
              <div className="label">{_t('ef3eb1706ee44000a42c', { currency: stakingToken })}</div>
              <div className="value">
                <NumFormatComp value={transformNumberPrecision(totalStakingAmount)} />
                <span className="unit">{stakingToken}</span>
              </div>
            </div>
            <div className="item">
              <div className="label">{_t('6952d3eb2aaa4000aad5')}</div>
              <div className="value">
                <NumFormatComp value={totalStakingParticipants} />
              </div>
            </div>
            <Apr className='item' apr={annualPercentageRate} isEnd={isEnd} inline={false} presetStatus={presetStatus} />
          </ProjectDataWrapper>
        </PoolCommonInfoWrapper>
        <Divider />
        <PoolSelfInfoWrapper>
          <div className="poolItemWrapper">
            <div className="top">
              <div className="symbolWrapper">
                <LazyImg src={stakingTokenLogo} alt="logo" />
                <span className="name">{_t('c956b8849c934000a979')}</span>
              </div>

              <div className="dataWrapper">
                <div className="item">
                  <div className="label">
                    {_t('8f26ebc5a5274000ae24', { currency: stakingToken })}
                  </div>
                  <div className="value">
                    <NumFormatComp value={stakingAmountTotal} />
                    {status === POOL_STATUS.IN_PROCESS && !!+userBonusCoefficient && !!user ? (
                      <RateComp value={userBonusCoefficient} />
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            {status === POOL_STATUS.COMPLETED ? (
              <div className="descWrapper">
                {_t('195ad2151a004000a769', { currency: stakingToken })}
              </div>
            ) : (
              <div className="buttonWrapper">
                {!user ? (
                  <div className="btn">
                    <Button onClick={skip2Login}>{_t('login')}</Button>
                  </div>
                ) : (
                  <>
                    <div className="assetsWrapper">
                      <AssetsComp
                        isMini={!lg}
                        isTotal={stakingToken === 'KCS'}
                        stakingToken={stakingToken}
                        tokenScale={tokenScale}
                      />
                    </div>
                    <div className="btn">
                      <Button onClick={handleStake}>{_t('dfdce9d75b6b4000a782')}</Button>
                      <Button
                        type="default"
                        onClick={handleUnstake}
                        disabled={!+stakingAmountTotal}
                      >
                        {_t('64625b9b64b14000af99')}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          <div className="poolItemWrapper">
            <div className="top">
              <div className="symbolWrapper">
                <LazyImg src={earnTokenLogo} alt="logo" />
                <span className="name">{_t('e7554855b5844000a674')}</span>
              </div>
              <div className="dataWrapper">
                {status !== POOL_STATUS.COMPLETED ? (
                  <>
                    <div className="item">
                      <Tooltip title={_t('e20c01836bdc4000a88a')}>
                        <div className="label underlineLabel">
                          {_t('42d507a50ab54000af9b', { currency: earnTokenName })}
                        </div>
                      </Tooltip>

                      <div className={`value ${+unclaimedRewards ? 'primary' : ''}`}>
                        <NumFormatComp
                          value={status === POOL_STATUS.NOT_START ? undefined : unclaimedRewards}
                        />
                      </div>
                    </div>
                    <Divider type="vertical" />
                    <div className="item">
                      <div className="label">
                        {_t('d8c1c4a187d74000aa44', { currency: earnTokenName })}
                      </div>
                      <div className="value">
                        <NumFormatComp
                          value={status === POOL_STATUS.NOT_START ? undefined : claimedRewards}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="item">
                    <div className="label">
                      {_t('d08217c3c8104000a3d4', { currency: earnTokenName })}
                    </div>
                    <div className="value">
                      <NumFormatComp value={claimedRewards} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {status === POOL_STATUS.COMPLETED ? (
              <div className="descWrapper">
                {_t('e954e76976134000a8e5', { currency: stakingToken })}
                {enableSymbol ? (
                  <a href={`/trade/${enableSymbol}`} onClick={handleToTradeBySymbol}>
                    {_t('c053128b66434000a695')}
                  </a>
                ) : null}
              </div>
            ) : (
              <div className="buttonWrapper">
                {!user ? (
                  <div className="btn">
                    <Button onClick={skip2Login}>{_t('login')}</Button>
                  </div>
                ) : (
                  <div className="btn">
                    <Button onClick={handleClaim} disabled={!+unclaimedRewards} loading={loading}>
                      {_t('d8d42c2099f44000a9e0')}
                    </Button>
                    {enableSymbol ? (
                      <Button onClick={handleToTradeBySymbol} type="default">
                        {_t('9f74506fd8214000a107')}
                      </Button>
                    ) : null}
                  </div>
                )}
              </div>
            )}
          </div>
        </PoolSelfInfoWrapper>
      </StyledPoolItem>
    </>
  );
}

export default memo(PoolCard);
