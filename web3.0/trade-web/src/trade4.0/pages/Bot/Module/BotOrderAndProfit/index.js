/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { _t } from 'Bot/utils/lang';
import Running from './Running';
import History from './History';
import Profits from './Profits/Lazy';
import { TabsPro, Wrapper, Scroller } from './style';
import ComponentWrapper from '@/components/ComponentWrapper';
import { breakPoints, name, WrapperContext } from './config';
import { useLocation } from 'react-router-dom';
import { calcRunningNum } from './Running/config';
import { useSelector } from 'dva';
import { trackClick } from 'utils/ga';

import PreloaderWrapper from 'Bot/components/PreloaderWrapper.js';
import ErrorBoundary from 'src/components/CmsComs/ErrorBoundary';

const tabsCFG = [
  {
    label: 'jFgbzGSLyC8CFie5Gf8kzB',
    value: 'running',
  },
  {
    label: 'k2v8azF9UTQQ7RZekxhsTn',
    value: 'history',
  },
  {
    label: '18xcPoDMsAUrV9sguSjLQi',
    value: 'profits',
  },
];
const sesorConfig = {
  running: '1',
  history: '2',
  profits: '3',
};
const RunningTab = React.forwardRef((props, ref) => {
  const runningLists = useSelector((state) => state.BotRunning.lists);
  const runningNum = calcRunningNum(runningLists);
  // const runText =
  //   runningNum > 0
  //     ? `${_t('jFgbzGSLyC8CFie5Gf8kzB')}(${runningNum})`
  //     : _t('jFgbzGSLyC8CFie5Gf8kzB');
  const runText = _t('tabpage2');
  return <TabsPro.Tab ref={ref} label={runText} {...props} />;
});

const TypeTab = React.memo(({ onChange, activeTab }) => {
  return (
    <TabsPro
      size="xsmall"
      variant="line"
      value={activeTab}
      onChange={onChange}
      showIndicator={false}
    >
      <RunningTab key="running" value="running" />
      <TabsPro.Tab key="history" value="history" label={_t('history')} />
      <TabsPro.Tab key="profits" value="profits" label={_t('18xcPoDMsAUrV9sguSjLQi')} />
    </TabsPro>
  );
});
/**
 * @description: 订单模块主入口
 * @return {*}
 */
export default React.memo(() => {
  const location = useLocation();
  const [activeTab, setTab] = React.useState(location.query.botOrderTab || 'running');
  const onTabChange = React.useCallback((e, v) => {
    trackClick(['botTabClick', sesorConfig[v]]);
    setTab(v);
  }, []);
  return (
    <ComponentWrapper name={name} context={WrapperContext} breakPoints={breakPoints}>
      <PreloaderWrapper>
        <Wrapper className="bot-order">
          <TypeTab activeTab={activeTab} onChange={onTabChange} />
          <Scroller>
            {activeTab === 'running' && (
              <ErrorBoundary>
                <Running className="bot-running" />
              </ErrorBoundary>
            )}
            {activeTab === 'history' && (
              <ErrorBoundary>
                <History className="bot-history" />
              </ErrorBoundary>
            )}
            {activeTab === 'profits' && (
              <ErrorBoundary>
                <Profits className="bot-profit" />
              </ErrorBoundary>
            )}
          </Scroller>
        </Wrapper>
      </PreloaderWrapper>
    </ComponentWrapper>
  );
});

