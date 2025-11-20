/*
 * @Owner: elliott.su@kupotech.com
 */
import React, { useEffect, useState, useRef } from 'react';
import { ThemeProvider, Snackbar, useTheme, EmotionCacheProvider } from '@kux/mui';
import { useDispatch } from 'dva';
import ComponentWrapper from '@/components/ComponentWrapper';
import { breakPoints, name, WrapperContext } from './config';
import PreloaderWrapper from 'Bot/components/PreloaderWrapper';
import { css } from '@/style/emotion';
import { Wrapper, Scroller } from './style';
import Running from './Running';
import History from './History';
import ErrorBoundary from 'src/components/CmsComs/ErrorBoundary';
import sensors from '@kucoin-base/sensors';
import { useLocale } from '@kucoin-base/i18n';

const { SnackbarProvider } = Snackbar;
const TAB_RUNNING = 'running';
const TAB_HISTORY = 'history';

/**
 * @description: 订单模块主入口
 * @param {string} botTab 当前/历史 running/history
 * @param {string} runningBotType 当前策略类型
 * @param {string} historyBotType 历史策略类型
 * @param {string} botStartTime 策略开始时间（历史策略使用）
 * @param {string} botEndTime 策略结束时间（历史策略使用）
 * @param {enum} source (orderCenter) 模块应用的地方
 */
const BotList = React.memo(({
  botTab,
  runningBotType,
  historyBotType,
  botStartTime,
  botEndTime,
  source,
}) => {
  const didMountRef = useRef(false);
  const dispatch = useDispatch();
  const isRunning = botTab === TAB_RUNNING;
  const isHistory = botTab === TAB_HISTORY;

  // 更新过滤条件
  const updateFilter = () => {
    // 运行中
    if (isRunning) {
      dispatch({
        type: 'BotRunning/update',
        payload: {
          botType: runningBotType,
        },
      });
      return;
    }
    // 历史
    dispatch({
      type: 'BotHistory/update',
      payload: {
        botType: historyBotType,
        startTime: botStartTime,
        endTime: botEndTime,
      },
    });
  };

  // 更新数据
  const updateDate = () => {
    // 运行中
    if (isRunning) {
      dispatch({
        type: 'BotRunning/update',
        payload: {
          lists: [],
        },
      });
      dispatch({ type: 'BotRunning/getRunningLists' });
      return;
    }
    // 历史
    dispatch({
      type: 'BotHistory/update',
      payload: {
        lists: [],
      },
    });
    dispatch({ type: 'BotHistory/getHistoryLists' });
  };

  updateFilter();

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    updateDate();
  }, [runningBotType, historyBotType, botStartTime, botEndTime]);

  const { colors } = useTheme();

  return (

    <ComponentWrapper
      name={name}
      context={WrapperContext}
      breakPoints={breakPoints}
      css={css`
            position: relative;

            .bot-order{
              padding-top: 0
            }

            // 来自订单中心的，表格无左右边距
            .CTable-TR {
              padding: 20px 0;
            }

            // 币种名称大小
            .running-dot {
              font-size: 14px;
              font-weight: 500;
              line-height: 130%;
            }

            // 表格的数值加粗
            .TD-value {
              font-size: 14px;
              font-weight: 500;
              line-height: 130%;
              color: ${colors.text};

              [data-value="default"] {
                color: ${colors.text}
              }
            }

            // 加载高度
            .bot-loading,.bot-empty > div {
              height: 180px;
            }
          `}
    >
      <Wrapper className="bot-order">
        <Scroller>
          {isRunning && (
            <ErrorBoundary>
              <Running className="bot-running" />
            </ErrorBoundary>
          )}
          {isHistory && (
            <ErrorBoundary>
              <History className="bot-history" />
            </ErrorBoundary>
          )}
        </Scroller>
      </Wrapper>
    </ComponentWrapper>

  );
});

export default (props) => {
  const [loaded, setLoaded] = useState(false);
  const { isRTL } = useLocale();

  useEffect(async () => {
    // 临时变量
    window.bot_source_is_from_order_center = props.source === 'orderCenter';

    // 初始化神策（因trade-web埋点方法使用window上的挂载对象，而消费者使用的是sensors，这里做个关联）
    if (!window.$KcSensors) {
      window.$KcSensors = sensors;
    }
    setLoaded(true);
  }, []);

  return (
    <ThemeProvider theme={props.theme}>
      <EmotionCacheProvider isRTL={isRTL}>
        <SnackbarProvider>
          <PreloaderWrapper source={props.source}>{loaded && <BotList {...props} />}</PreloaderWrapper>
        </SnackbarProvider>
      </EmotionCacheProvider>
    </ThemeProvider>
  );
};
