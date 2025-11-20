/**
 * Owner: solar@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useLocale } from '@kucoin-base/i18n';
import { ICShareOutlined, ICWaitOutlined } from '@kux/icons';
import { Button, useResponsive } from '@kux/mui';
import { dateTimeFormat } from '@kux/mui/utils';
import { useCountDown } from 'ahooks';
import AnimateButton from 'components/RocketZone/components/AnimateButton';
import debounce from 'lodash/debounce';
import map from 'lodash/map';
import moment from 'moment';
import { memo, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import LazyImg from 'src/components/common/LazyImg';
import siteCfg from 'src/utils/siteConfig';
import emptyData from 'static/gempool/emptyData.png';
import defaultSvg from 'static/rocket_zone/default.svg';
import FireIcon from 'static/rocket_zone/fire.gif';
import InfoImg from 'static/rocket_zone/info.png';
import SuspensionImg from 'static/rocket_zone/suspension.png';
import { addLangToPath, _t } from 'tools/i18n';
import { useVaildSymbol } from 'TradeActivity/hooks';
import { locateToUrlInApp, transformTimeStr } from 'TradeActivity/utils';
import { trackClick } from 'utils/ga';
import { push } from 'utils/router';
import { PROJECT_TYPE } from '../../constant';
import { useResponsiveSize } from '../../hooks';
import {
  ActivityTimeWrapper,
  EmptyWrapper,
  EndActivityWrapper,
  HeaderWrapper,
  LinkWrapper,
  StyledActivity,
  StyledButtonGroup,
  StyledDetailInfo,
  StyledProject,
  StyledRightWrapper,
  StyledStartTime,
  StyledTimer,
} from './styledComponents';

const { KUCOIN_HOST } = siteCfg;

const findSource = (() => {
  const requireContext = require.context('static/rocket_zone', false, /^\.\/.*\.png$/);
  return function (filename) {
    return requireContext(`./${filename}`);
  };
})();

const Hot = memo(({ className }) => {
  return useMemo(() => {
    const sizeProps = { height: 20, width: 20 };
    return <img src={FireIcon} alt="fire" className={className} {...sizeProps} />;
  }, [className]);
});

const CountDown = memo(({ date, typeName }) => {
  const dispatch = useDispatch();

  const handleDataList = useCallback(() => {
    if (typeName === 'newListing') {
      dispatch({
        type: 'rocketZone/pullNewListing',
      });
    } else {
      dispatch({
        type: 'rocketZone/pullGemspaceOngoingGem',
      });
    }
  }, [dispatch, typeName]);

  const [__, formattedRes] = useCountDown({
    targetDate: date,
    interval: 1000,
    onEnd: handleDataList,
  });

  const { days, hours, minutes, seconds } = formattedRes;

  return useMemo(() => {
    return (
      <StyledTimer>
        <div className="item">
          <div className="time">{transformTimeStr(days)}</div>
          <div className="unit">D</div>
        </div>
        <div className="item">
          <div className="time">{transformTimeStr(hours)}</div>
          <div className="unit">H</div>
        </div>
        <div className="item">
          <div className="time">{transformTimeStr(minutes)}</div>
          <div className="unit">M</div>
        </div>
        <div className="item">
          <div className="time">{transformTimeStr(seconds)}</div>
          <div className="unit">S</div>
        </div>
      </StyledTimer>
    );
  }, [days, hours, minutes, seconds]);
});

const CountDownComp = memo(({ startDate, endDate, typeName, displayTradeEndAt }) => {
  // 新币专区逻辑特殊处理
  if (typeName === 'newListing') {
    if (!startDate) {
      // 新币专区 -- 无开始交易时间
      return (
        <EndActivityWrapper>
          <img src={SuspensionImg} alt="icon" />
          {_t('a264b56171334000abf3')}
        </EndActivityWrapper>
      );
    } else if (moment().isAfter(startDate)) {
      // 新币专区 -- 已超过开始时间
      return (
        <EndActivityWrapper>
          <img src={InfoImg} alt="icon" />
          {_t('98cd918698184000aa05')}
        </EndActivityWrapper>
      );
    } else {
      return (
        <ActivityTimeWrapper>
          <div className="label">{_t('cc051e087cf34000ac22')}</div>
          <CountDown date={startDate} typeName={typeName} />
        </ActivityTimeWrapper>
      );
    }
  }

  // 其他活动 -- 过了结束时间
  if (moment().isAfter(endDate)) {
    // 活动已结束
    return (
      <EndActivityWrapper>
        <img src={InfoImg} alt="icon" />
        {_t('77b347f349834000a2b4')}
      </EndActivityWrapper>
    );
  }

  // 未开始
  const notStart = moment().isBefore(startDate);

  // 盘前交易逻辑特殊处理 --- 过了开始时间，且不显示结束时间时，展示活动已开启
  if (typeName === 'gemPreMarket' && !displayTradeEndAt && !notStart) {
    // 活动已结束
    return (
      <EndActivityWrapper>
        <img src={SuspensionImg} alt="icon" />
        {_t('mwFLzC81JFFCjN85wqwo7L')}
      </EndActivityWrapper>
    );
  }

  return (
    <ActivityTimeWrapper>
      <div className="label">
        {notStart ? _t('cc051e087cf34000ac22') : _t('8ce4eb44b10f4000ae05')}
      </div>
      <CountDown date={notStart ? startDate : endDate} typeName={typeName} />
    </ActivityTimeWrapper>
  );
});

const Activity = memo(
  ({
    fire,
    worldPremiere,
    startActivity, // 活动开始时间，gemvote特殊返回投票开始时间
    endActivity, // 活动结束时间，gemvote特殊返回投票结束时间
    startTrade,
    endTrade,
    shortName,
    fullName,
    logoUrl,
    jumpUrl,
    jumpHref,
    shareImageUrl,
    defaultImageUrl,
    typeName,
    title,
    displayTradeEndAt,
  }) => {
    const isInApp = JsBridge.isApp();
    const dispatch = useDispatch();
    const vaildSymbol = useVaildSymbol(`${shortName}-USDT`);

    const startDate = useMemo(() => {
      // premarket特殊处理
      if (typeName === 'gemPreMarket') {
        return startActivity * 1000 || 0;
      }
      return startTrade || startActivity || 0;
    }, [startActivity, startTrade, typeName]);

    const endDate = useMemo(() => {
      if (typeName === 'gemPreMarket') {
        return endActivity * 1000 || 0;
      }
      return endTrade || endActivity || 0;
    }, [endActivity, endTrade, typeName]);

    const size = useResponsiveSize();
    const { currentLang } = useLocale();

    // 防止app内用户点击多次，弹出多次弹框
    const handleShare = useCallback(
      debounce(
        () => {
          dispatch({
            type: 'rocketZone/update',
            payload: {
              shareInfo: {
                shareImg: shareImageUrl || defaultImageUrl,
                shareUrl: typeName === 'newListing' ? '/gemspace/newlisting' : '/gemspace/ongoing',
              },
              shareModal: Math.random(),
            },
          });

          trackClick([typeName, 'Share'], { symbol: shortName });
        },
        2000,
        { trailing: false, leading: true },
      ),
      [dispatch, shareImageUrl, defaultImageUrl, shortName, typeName],
    );

    const handleJump = useCallback(() => {
      // admin配置了jumpUrl则使用jumpUrl 否则使用默认
      const _jumpUrl = jumpUrl || (jumpHref && jumpHref(shortName));
      if (_jumpUrl) {
        if (isInApp) {
          const tragetUrl =
            _jumpUrl?.indexOf('https') > -1
              ? addLangToPath(_jumpUrl)
              : KUCOIN_HOST + addLangToPath(_jumpUrl);
          JsBridge.open({
            type: 'jump',
            params: {
              url: `/link?url=${encodeURIComponent(tragetUrl)}`,
            },
          });
        } else {
          push(_jumpUrl);
        }
      }

      trackClick([typeName, 'Join'], { symbol: shortName });
    }, [jumpUrl, jumpHref, shortName, typeName, isInApp]);

    const handleTrade = useCallback(() => {
      if (!vaildSymbol) return;
      if (isInApp) {
        // app内跳转
        JsBridge.open({
          type: 'jump',
          params: {
            url: `/trade?symbol=${vaildSymbol}&goBackUrl=${encodeURIComponent(
              window.location.href,
            )}`,
          },
        });
      } else {
        push(`/trade/${vaildSymbol}`);
      }
      trackClick(['newListing', 'Trade'], { symbol: vaildSymbol });
    }, [vaildSymbol, isInApp]);

    const handleJumpNewListing = useCallback(() => {
      if (isInApp) {
        // app内跳转
        JsBridge.open({
          type: 'jump',
          params: {
            url: `/flutter?route=/newcoin/home`,
          },
        });
      } else {
        push('/markets/new-cryptocurrencies');
      }

      trackClick(['newListing', 'Join'], { symbol: shortName });
    }, [shortName, isInApp]);

    // 只显示开始时间，不需要根据结束时间状态区别展示
    const startTime = useMemo(() => {
      // 移动端结束后不显示
      if (moment().isAfter(endDate) && size === 'sm') return null;
      return (
        <StyledStartTime>
          <span className="start-label">{_t('n3qrfcenQoma4ZhL1krR5t')}</span>
          <span className="time-value">
            {startDate
              ? `${dateTimeFormat({
                  lang: currentLang,
                  date: startDate,
                  options: { second: undefined, timeZone: 'UTC' },
                })}`
              : '--'}
          </span>
        </StyledStartTime>
      );
    }, [currentLang, startDate, endDate, size]);

    const tagInfo = useMemo(() => {
      if (!fire && !worldPremiere) return;

      return (
        <div className="tag">
          {fire && <Hot className="hot" />}
          {worldPremiere && (
            <div className="label">
              <span>{_t('aobTYeFRCrghvyU9ELVMp7')}</span>
            </div>
          )}
        </div>
      );
    }, [fire, worldPremiere]);

    // 根据时间状态显示不同按钮
    const btnComp = useMemo(() => {
      if (typeName === 'newListing') {
        // 新币专区按钮
        // 已开启交易
        if (moment().isAfter(startDate)) {
          // 进行中显示去交易
          return (
            <AnimateButton
              onClick={handleTrade}
              className="subscribe-btn"
              fullWidth={size === 'sm'}
            >
              {_t('rg5JBATufUfWUkx3gkSvxw')}
            </AnimateButton>
          );
        } // 进行中显示立即预约
        return (
          <AnimateButton
            onClick={handleJumpNewListing}
            className="subscribe-btn"
            fullWidth={size === 'sm'}
          >
            {_t('51ikidpoaNLpQvPPmtcjxq')}
          </AnimateButton>
        );
      } else {
        // 未开始或已结束 显示查看
        if (moment().isBefore(startDate) || moment().isAfter(endDate)) {
          return (
            <Button
              onClick={handleJump}
              className="subscribe-btn"
              fullWidth={size === 'sm'}
              type="default"
            >
              {_t('pKkEvKAzGPcTbthrw7ypWu')}
            </Button>
          );
        }

        // 进行中显示立即参与
        return (
          <AnimateButton onClick={handleJump} className="subscribe-btn" fullWidth={size === 'sm'}>
            {typeName === 'gemPreMarket'
              ? _t('rg5JBATufUfWUkx3gkSvxw')
              : _t('371e1a74535c4000ad95')}
          </AnimateButton>
        );
      }
    }, [handleJump, handleTrade, handleJumpNewListing, startDate, endDate, size, typeName]);

    return (
      <StyledActivity>
        <HeaderWrapper>
          <div className="header-wrapper">
            <div className="logo">
              <LazyImg
                src={
                  moment().isBefore(startDate) && typeName === 'gemVote'
                    ? defaultSvg
                    : logoUrl || defaultSvg
                }
              />
            </div>

            <StyledRightWrapper>
              <div className="title-container">
                {typeName === 'gemVote' ? (
                  <div className="miniTitle">{title}</div>
                ) : (
                  <div className="title">
                    <div className="name">
                      <span>{shortName}</span>
                      {tagInfo}
                    </div>
                    <div className="fullName">{fullName}</div>
                  </div>
                )}
              </div>
              {size === 'lg' && startTime}
            </StyledRightWrapper>
          </div>
          {size !== 'lg' && startTime}
        </HeaderWrapper>

        <CountDownComp
          startDate={startDate}
          endDate={endDate}
          typeName={typeName}
          displayTradeEndAt={displayTradeEndAt}
        />

        <StyledButtonGroup>
          {btnComp}
          <div className="share-btn" onClick={handleShare} tabIndex={-1} role="button">
            <ICShareOutlined />
          </div>
        </StyledButtonGroup>
      </StyledActivity>
    );
  },
);

const ProjectIcon = memo(({ icon, ...rest }) => {
  return useMemo(() => {
    const source = findSource(`${icon}.png`);
    return <LazyImg src={source} className="project-icon" {...rest} />;
  }, [icon]);
});

// TODO 新币模块暂未改动，后续规划会调整
function Project(props) {
  const { typeName, details = [], id, ...rest } = props || {};
  const isInApp = JsBridge.isApp();
  const { currentLang } = useLocale();
  const { sm } = useResponsive();

  const { moreHref, jumpHref, defaultImageUrl, subTitle, bg, icon, title, detailDatas } =
    useMemo(() => {
      return PROJECT_TYPE(isInApp, currentLang)[typeName] || {};
    }, [isInApp, typeName, currentLang]);

  const contentList = useMemo(() => {
    return map(details, (item, index) => {
      return (
        <Activity
          {...item}
          typeName={typeName}
          jumpHref={jumpHref}
          defaultImageUrl={defaultImageUrl}
          key={`activity_${index}`}
        />
      );
    });
  }, [typeName, jumpHref, details, defaultImageUrl]);

  const handleMore = useCallback(() => {
    trackClick([typeName, 'More']);
    locateToUrlInApp(moreHref);
  }, [moreHref, typeName]);

  if (!title) return null;

  return (
    <StyledProject id={id} className={typeName === 'newListing' ? 'newListing' : ''}>
      <div className="bg" />
      {bg && sm && <ProjectIcon icon={bg} className="logoBg" />}

      <div className="content">
        <div className="header">
          <h2 className="main-title">
            <div className="title-wrapper">
              <ProjectIcon icon={icon} />
              {title}
            </div>
            {moreHref && (
              <LinkWrapper to={moreHref} onClick={handleMore} dontGoWithHref={isInApp}>
                <ICWaitOutlined />
                {_t('egx2bSQF1AHr1TrpoZDoaz')}
              </LinkWrapper>
            )}
          </h2>
          {subTitle && <div className="sub-title">{subTitle}</div>}
        </div>
        {typeof detailDatas === 'function' ? (
          <StyledDetailInfo>
            {map(detailDatas({ ...rest }), ({ label, comp }, index) => {
              return (
                <div className="item">
                  <div className="value">{comp}</div>
                  {label}
                </div>
              );
            })}
          </StyledDetailInfo>
        ) : null}

        {details?.length ? (
          contentList
        ) : (
          <EmptyWrapper>
            <img src={emptyData} alt="empty" />
            {_t('i6chu81TBpiijMEkcqwfCF')}
          </EmptyWrapper>
        )}
      </div>
    </StyledProject>
  );
}

export default memo(Project);
