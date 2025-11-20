/*
 * owner: borden@kupotech.com
 */
import history from '@kucoin-base/history';
import { useLocale } from '@kucoin-base/i18n';
import { ICArrowRightOutlined } from '@kux/icons';
import { styled, useColor, useResponsive } from '@kux/mui';
import loadable from '@loadable/component';
import { useLockFn, useMemoizedFn } from 'ahooks';
import LazyImg from 'components/common/LazyImg';
import useRequest from 'hooks/useRequest';
import { useSelector } from 'hooks/useSelector';
import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import Button from 'routes/SlothubPage/components/mui/Button';
import { SENSORS } from 'routes/SlothubPage/constant';
import { enrollCurrencyProject, reserveCurrencyProject } from 'services/slothub';
import DateTimeUTCFormat from 'src/routes/SlothubPage/components/mui/DateTimeUTCFormat';
import { addLangToPath, _t } from 'src/tools/i18n';
import hotIcon from 'static/slothub/hot.svg';
import kuwardIcon from 'static/slothub/kuward.svg';
import animateTagIcon from 'static/slothub/tip-flag.svg';
import siteConfig from 'utils/siteConfig';
import NumberFormat from '../../../components/mui/NumberFormat';
import OriginReciviceButton from '../../../components/ReciviceButton';
import SeoLink from '../../../components/SeoLink';
import TimeCountDown from '../../../components/TimeCountDown';
import { LINKS, STATIC_CUTDOWN } from '../../../constant';
import withAuth from '../../../hocs/withAuth';
import withKyc from '../../../hocs/withKyc';
import useReceiveButton from '../../../hooks/useReceiveButton';
import useReserveCallback from '../../../hooks/useReserveCallback';
import { formatHotAmount, jumpTo, jumpToTradeWithSymbol } from '../../../utils';
import {
  Alert,
  AlertOpration,
  AnimateTag,
  BannerContent,
  BannerFooter,
  BannerHeader,
  Buttons,
  CardBanner,
  CardBg,
  DateBox,
  HighlightValue,
  HotAmount,
  Label,
  Link,
  Logo,
  Mask,
  Name,
  Progress,
  ProgressLabel,
  Row,
  StatusFlag,
  TaskCard,
  Value,
} from './style';
const Help = loadable(() =>
  import('routes/SlothubPage/components/Help').then((module) => module.default),
);

const { KUCOIN_HOST } = siteConfig;
const AuthButton = withAuth((props) => <Button {...props} />);
const KycButton = withKyc((props) => <AuthButton {...props} />);

const StyledButton = styled(Button)`
  &:hover {
    color: ${(props) => props.theme.colors.cover};
  }
`;

const ReciviceButton = ({ taskId, projectId, currency, callback, ...restProps }) => {
  const receiveButton = useReceiveButton({ taskId, projectId, currency, callback });
  return <OriginReciviceButton {...restProps} {...receiveButton} />;
};

const RenderReciviceButton = ({ task, children, ...restProps }) => {
  const receiveTimes = task?.completeTimes - task?.rewardTimes;
  if (receiveTimes > 0) {
    return <ReciviceButton taskId={task.id} receiveTimes={receiveTimes} {...restProps} />;
  }
  return children;
};

/**
 * status:
 * 0, "未上线"
 * 1, "运行中"
 * 2, "奖励分发中"
 * 3, "已结束"
 * 4, "已下线"
 */
const Item = (props) => {
  const {
    id,
    hot,
    tasks,
    status,
    endTime,
    myPoints,
    myRewards,
    startTime,
    currency,
    refreshFn,
    isReserved,
    guidePoints,
    displayAmount,
    exchangeAvailable,
    code,
    rewardCurrency,
  } = props;
  const colors = useColor();
  const { sm } = useResponsive();
  const dispatch = useDispatch();
  const { isRTL, currentLang } = useLocale();
  const ceserveCallback = useReserveCallback();
  const isLogin = useSelector((state) => state.user.isLogin);
  const categories = useSelector((state) => state.categories);

  const detailLink = addLangToPath(`${KUCOIN_HOST}/gemslot/detail/code/${code}`);

  const { runAsync: enrollCurrencyProjectFetch, loading: enrollCurrencyProjectLoading } =
    useRequest(() => enrollCurrencyProject({ projectId: id }), {
      manual: true,
      onSuccess: () => {
        if (typeof refreshFn === 'function') {
          refreshFn();
        }
      },
    });

  const { runAsync: reserveCurrencyProjectFetch, loading: reserveCurrencyProjectLoading } =
    useRequest(() => reserveCurrencyProject({ projectId: id }), {
      manual: true,
      onSuccess: () => {
        if (typeof refreshFn === 'function') {
          ceserveCallback();
          refreshFn();
        }
      },
    });
  // 预约,报名操作加竞态锁
  const enrollFetch = useLockFn(enrollCurrencyProjectFetch);
  const reserveFetch = useLockFn(reserveCurrencyProjectFetch);

  const now = Date.now();
  const { iconUrl, currencyName = '--' } = categories[currency] || {};
  // 已结束
  const isEnded = ![1].includes(status);
  // 进行中
  const isRunning = [1].includes(status) && startTime <= now;
  // 即将开始
  const isNotLaunched = [1].includes(status) && startTime >= now;
  // 是否中签
  const isWon = myPoints > 0;
  // 已报名
  const isEposited = isReserved;
  // 奖励分发中
  const isDistributing = status === 2;

  // 任务卡状态标签
  const statusTag = useMemo(() => {
    if (isRunning && isEposited) {
      return {
        value: 1,
        label: _t('6518a0e63ee84000a7ab'),
        style: {
          color: '#D3F475',
          background: 'rgba(211, 244, 117, 0.16)',
        },
      };
    }
    if (isEnded && isWon) {
      return {
        value: 2,
        label: _t('1b4a3cac8c2e4000a8e3'),
        style: {
          color: '#1D1D1D',
          background: '#D3F475',
        },
      };
    }
    if (isEnded && isLogin & isEposited) {
      return {
        value: 3,
        label: _t('e7bbc0c2ef914000a9ae'),
        style: {
          color: 'rgba(243, 243, 243, 0.6)',
          background: 'rgba(243, 243, 243, 0.12)',
        },
      };
    }
    return null;
  }, [isRunning, isEnded, isWon, isEposited, isLogin]);

  const { tradeTask, depositTask } = useMemo(() => {
    const _tasks = {};
    const len = tasks?.length;
    if (!len) return _tasks;
    for (let i = 0; i < len; i++) {
      if (_tasks.tradeTask && _tasks.depositTask) {
        return _tasks;
      }
      if (tasks[i].taskType === 2) _tasks.tradeTask = tasks[i];
      if (tasks[i].taskType === 3) _tasks.depositTask = tasks[i];
    }
    return _tasks;
  }, [tasks]);

  const toDetailPage = useMemoizedFn((event) => {
    if (!code) return;

    event.preventDefault();
    SENSORS.details({ currency });

    const targetDetailUrl = `/gemslot/detail/code/${code}`;

    // App内 启用webview tab跳转
    // if (JsBridge.isApp()) {
    //   const appLink = `${encodeURIComponent(KUCOIN_HOST + addLangToPath(targetDetailUrl))}`;
    //   JsBridge.open({
    //     type: 'jump',
    //     params: {
    //       url: `/link?url=${appLink}`,
    //     },
    //   });
    //   return;
    // }
    history.push(targetDetailUrl);
  });

  const toTradePage = useMemoizedFn(() => {
    SENSORS.trade({ currency });
    jumpToTradeWithSymbol(currency === 'USDT' ? 'BTC-USDT' : `${currency}-USDT`);
  });

  const toDepositPage = useMemoizedFn(() => {
    SENSORS.deposit({ currency });
    jumpTo(LINKS.deposit(currency));
  });
  // 预约
  const reserve = useMemoizedFn(() => {
    SENSORS.reserve({ currency });
    reserveFetch();
  });
  // 报名
  const enroll = useMemoizedFn(() => {
    // 新人引导场景 不进行报名请求 ，新人引导已作点击拦截 此处兜底event-point:none兼容性穿透
    if (!!guidePoints) {
      return;
    }
    SENSORS.enroll({ currency });
    enrollFetch();
  });
  // 兑换
  const convert = useMemoizedFn(() => {
    SENSORS.currencyExchange({ currency });
    dispatch({
      type: 'slothub/updateConvertDialogConfig',
      payload: {
        currency,
        open: true,
      },
    });
  });

  const handleEnd = useMemoizedFn(() => {
    if (typeof refreshFn === 'function') {
      refreshFn();
    }
  });

  const renderButtons = () => {
    const commonProps = {
      size: sm ? 'large' : 'basic',
    };
    if (!isLogin && (isNotLaunched || isRunning)) {
      return [
        <StyledButton
          type="default"
          {...commonProps}
          key="detail"
          onClick={toDetailPage}
          href={detailLink}
          as="a"
        >
          {_t('28d15ac634fc4000a41c')}
        </StyledButton>,
        <AuthButton
          key="login"
          type="primary"
          className="ml-8"
          style={{ flex: 1 }}
          {...commonProps}
        >
          {isNotLaunched ? _t('ce816d5874634000a576') : _t('371e1a74535c4000ad95')}
        </AuthButton>,
      ];
    }
    if (isNotLaunched && !isReserved) {
      return [
        <StyledButton
          type="default"
          {...commonProps}
          key="detail"
          onClick={toDetailPage}
          href={detailLink}
          as="a"
        >
          {_t('28d15ac634fc4000a41c')}
        </StyledButton>,
        <AuthButton
          key="reserve"
          type="primary"
          className="ml-8"
          onClick={reserve}
          style={{ flex: 1 }}
          loading={reserveCurrencyProjectLoading}
          {...commonProps}
        >
          {_t('ce816d5874634000a576')}
        </AuthButton>,
      ];
    }
    if (isNotLaunched && isReserved) {
      return [
        <StyledButton
          key="detail"
          type="default"
          {...commonProps}
          onClick={toDetailPage}
          href={detailLink}
          as="a"
        >
          {_t('28d15ac634fc4000a41c')}
        </StyledButton>,
        <Button
          disabled
          type="default"
          key="reserved"
          className="ml-8"
          style={{ flex: 1 }}
          {...commonProps}
        >
          {_t('a989f67835fa4000aa75')}
        </Button>,
      ];
    }
    if (isRunning && !isEposited) {
      return [
        <StyledButton
          key="detail"
          type="default"
          {...commonProps}
          onClick={toDetailPage}
          href={detailLink}
          as="a"
        >
          {_t('28d15ac634fc4000a41c')}
        </StyledButton>,
        <KycButton
          key="enroll"
          type="primary"
          className="ml-8"
          onClick={enroll}
          style={{ flex: 1, position: 'relative' }}
          loading={enrollCurrencyProjectLoading}
          {...commonProps}
        >
          {_t('371e1a74535c4000ad95')}
          {guidePoints?.enroll}
        </KycButton>,
      ];
    }
    if (isRunning && isEposited) {
      // const tradeReciviceTimes = tradeTask?.completeTimes - tradeTask?.rewardTimes;
      // const depositReciviceTimes = depositTask?.completeTimes - depositTask?.rewardTimes;
      // const isAllHasReciviceTimes = [tradeReciviceTimes, depositReciviceTimes].every((v) => v > 0);
      // const timesCount = (tradeReciviceTimes || 0) + (depositReciviceTimes || 0);
      const commonReciviceButtonProps = {
        ...commonProps,
        currency,
        projectId: id,
        style: { flex: 1 },
        callback: refreshFn,
      };

      // 后端实现不了同时进行多个任务的领取，经过产品@Irine、设计@Yuki确认，不进行合并按钮，可以同时存在两个领取
      // if (isAllHasReciviceTimes) {
      //   return <ReciviceButton receiveTimes={timesCount} {...commonReciviceButtonProps} />;
      // }

      return [
        depositTask ? (
          <RenderReciviceButton key="deposit" task={depositTask} {...commonReciviceButtonProps}>
            <AuthButton
              type="default"
              onClick={toDepositPage}
              style={{ flex: 1, position: 'relative' }}
              {...commonProps}
            >
              {_t('fd427664543d4000a9dd')}
              <AnimateTag isRTL={isRTL} src={animateTagIcon} alt="tip flag" />
            </AuthButton>
          </RenderReciviceButton>
        ) : null,
        tradeTask ? (
          <RenderReciviceButton key="trade" task={tradeTask} {...commonReciviceButtonProps}>
            <AuthButton
              type="primary"
              onClick={toTradePage}
              style={{ flex: 1, position: 'relative' }}
              {...commonProps}
            >
              {_t('9f74506fd8214000a107')}
              <AnimateTag isRTL={isRTL} src={animateTagIcon} alt="tip flag" />
            </AuthButton>
          </RenderReciviceButton>
        ) : null,
      ];
    }
    return (
      <StyledButton
        fullWidth
        type="default"
        {...commonProps}
        onClick={toDetailPage}
        href={detailLink}
        style={{ flex: 1 }}
        as="a"
      >
        {_t('28d15ac634fc4000a41c')}
      </StyledButton>
    );
  };

  return (
    <TaskCard>
      <CardBanner data-inspector="gemslot_task_to_detail" href={detailLink} onClick={toDetailPage}>
        <Mask>
          <CardBg src={iconUrl} alt="coin icon" />
          <BannerHeader>
            {!isNotLaunched && (
              <HotAmount>
                <LazyImg src={hotIcon} alt="hot icon" width={12} height={12} />
                <span className="ml-2">{formatHotAmount({ value: hot, lang: currentLang })}</span>
              </HotAmount>
            )}
          </BannerHeader>
          <BannerContent className="slot-taskItem-name">
            <div className="flex-center">
              <Logo src={iconUrl} alt="coin icon" />
              <Name>{currencyName}</Name>
            </div>
          </BannerContent>
          {Boolean(statusTag) && <StatusFlag style={statusTag.style}>{statusTag.label}</StatusFlag>}
          <BannerFooter>
            <Progress isRTL={isRTL}>
              {isEnded ? (
                <ProgressLabel>{_t('07e43af0e0574000a983')}</ProgressLabel>
              ) : (
                <>
                  <ProgressLabel>
                    {isNotLaunched ? _t('8583a5a3d34b4000acd8') : _t('9daa36bfc6ce4000ace0')}
                  </ProgressLabel>
                  <TimeCountDown
                    onEnd={handleEnd}
                    size={sm ? 'basic' : 'small'}
                    className={sm ? 'ml-6' : 'ml-4'}
                    isStaticValue={!!guidePoints}
                    value={guidePoints ? STATIC_CUTDOWN : isNotLaunched ? startTime : endTime}
                    intervalThemeConfig={{
                      gapWidth: 2,
                      colorTheme: 'light',
                    }}
                  />
                </>
              )}
            </Progress>
            {isRunning && isEposited && (
              <SeoLink href={detailLink}>
                <Link>
                  {_t('28d15ac634fc4000a41c')}
                  <ICArrowRightOutlined className="ml-2 horizontal-flip-in-arabic" />
                </Link>
              </SeoLink>
            )}
            {isEnded && (
              <DateBox>
                <DateTimeUTCFormat
                  date={endTime}
                  lang={currentLang}
                  options={{ second: undefined }}
                >
                  {endTime}
                </DateTimeUTCFormat>
              </DateBox>
            )}
          </BannerFooter>
        </Mask>
      </CardBanner>
      <Row className={sm ? 'mt-16' : 'mt-12'}>
        <Label>{_t('bbc97b1b3cc84000a8a6')}</Label>
        <HighlightValue>
          <NumberFormat>{displayAmount}</NumberFormat>
          <span className="ml-4">{rewardCurrency}</span>
        </HighlightValue>
      </Row>
      {!isNotLaunched && isEposited && (
        <Row className={sm ? 'mt-16' : 'mt-12'}>
          <Label>
            <LazyImg
              width={14}
              height={14}
              src={kuwardIcon}
              alt="kuward icon"
              className="mr-4 horizontal-flip-in-arabic"
            />
            {_t('73e9569079434000a5f9', { token: currencyName })}
          </Label>
          <Value>
            <NumberFormat>{myPoints}</NumberFormat>
          </Value>
        </Row>
      )}
      {isRunning && isEposited && (
        <Alert
          exchangeAvailable={exchangeAvailable}
          {...(exchangeAvailable ? { onClick: convert } : null)}
        >
          {_t('764256236df54000aec4', { token: currencyName })}
          <AlertOpration>
            {!exchangeAvailable && (
              <Help title={_t('b23acaafa99d4000ae8a', { token: currencyName })}>
                <span className="mr-2" style={{ cursor: 'help' }}>
                  {_t('c11fbe5f922f4000ae44')}
                </span>
              </Help>
            )}
            <ICArrowRightOutlined color={colors.text40} className="horizontal-flip-in-arabic" />
          </AlertOpration>
        </Alert>
      )}
      {isEnded && isEposited && (
        <Row className="mt-8">
          <Label>{_t('f66b273f3b054000af2a')}</Label>
          <Value>
            {isDistributing ? (
              <span style={{ color: '#01BC8D' }}>{_t('00907928de3e4000a647')}</span>
            ) : (
              <NumberFormat>{myRewards}</NumberFormat>
            )}
          </Value>
        </Row>
      )}
      <Buttons>{renderButtons()}</Buttons>
    </TaskCard>
  );
};

export default React.memo(Item);
