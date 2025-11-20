/**
 * Owner: mike@kupotech.com
 */
import React, { useCallback, useState, useImperativeHandle, Suspense } from 'react';
import { shallowEqual, useSelector, useDispatch } from 'dva';
import Drawer from '@mui/Drawer';
import Button from '@mui/Button';
import { Tabs } from '@mui/Tabs';
import { _t, t } from 'Bot/utils/lang';
import useMergeState from 'Bot/hooks/useMergeState.js';
import { SpinWrapper, ButtonWrapper, TabContent } from './style';
import { useGetPart } from 'Bot/Strategies';
import { strasMap } from 'Bot/config';
import ErrorBoundary from 'src/components/CmsComs/ErrorBoundary';

const { Tab } = Tabs;
/**
 * @description: tab的名字定义在组件上, 这里获取名字;没定义就会采用默认的名字
 * @param {array} Module
 * @return {array}
 */
const getTabsName = (Module = [], mode) => {
  const names = [
    { tabName: 'openorders', value: 0 },
    {
      tabName: 'stopOrders',
      value: 1,
    },
    {
      tabName: 'robotParams',
      value: 2,
    },
  ];
  Module.forEach((md, index) => {
    if (md.title) {
      names[index].tabName = md.title;
    }
  });
  if (mode === 'history') {
    names.shift();
  }
  return names;
};

const DrawerContent = ({ modelName, templateType, mode, data, onClose }) => {
  const [activeTab, setActiveTab] = useState(mode === 'running' ? 0 : 1);
  const LoadingIndex = useSelector((state) => {
    return {
      0: state[modelName].CurrentLoading,
      1: state[modelName].HistoryLoading,
      2: state[modelName].ParamaterLoading,
    };
  }, shallowEqual);
  const Module = useGetPart({ currentBot: templateType, part: 'Detail' });
  if (!Module) {
    return null;
  }
  const { Current, History, Paramater } = Module;
  const tabsName = getTabsName([Current, History, Paramater], mode);
  return (
    <SpinWrapper spinning={LoadingIndex[activeTab]}>
      <Tabs value={activeTab} onChange={(e, value) => setActiveTab(value)} size="medium">
        {tabsName.map(({ tabName, value }) => (
          <Tab label={_t(tabName)} value={value} key={value} />
        ))}
      </Tabs>

      {mode === 'running' && (
        <TabContent hidden={!(activeTab === 0)}>
          <Suspense fallback={<div />}>
            <Current isActive={activeTab === 0} onClose={onClose} runningData={data} mode={mode} />
          </Suspense>
        </TabContent>
      )}
      <TabContent hidden={!(activeTab === 1)}>
        <Suspense fallback={<div />}>
          <History isActive={activeTab === 1} onClose={onClose} runningData={data} mode={mode} />
        </Suspense>
      </TabContent>
      <TabContent hidden={!(activeTab === 2)}>
        <Suspense fallback={<div />}>
          <Paramater isActive={activeTab === 2} onClose={onClose} runningData={data} mode={mode} />
        </Suspense>
      </TabContent>

      <ButtonWrapper>
        <Button onClick={onClose}>{_t('gridwidget6')}</Button>
      </ButtonWrapper>
    </SpinWrapper>
  );
};
/**
 * @description: 运行/历史记录的订单详情弹窗模板
 * @param {object} data
 * @param {boolean} visible
 * @param {function} onClose
 * @param {enum} mode (running, history) 运行模式|历史模式
 * @return {*}
 */
const DetailModal = React.memo(({ data = {}, visible, onClose, mode }) => {
  const { type: templateType } = data;
  const { lang: strategyName, botName: modelName } = strasMap.get(Number(templateType));

  return (
    <Drawer
      width="560px"
      back={false}
      show={visible}
      anchor="right"
      onClose={onClose}
      contentPadding="0"
      title={_t(strategyName)}
      className="bot-drawer"
    >
      <DrawerContent
        data={data}
        onClose={onClose}
        modelName={modelName}
        templateType={templateType}
        mode={mode}
      />
    </Drawer>
  );
});

const ControlRef = React.forwardRef((props, ref) => {
  const [{ visible, data }, setMergeState] = useMergeState({
    visible: false,
    data: {
      type: '',
    },
  });
  const dispatch = useDispatch();
  const onClose = useCallback(() => {
    setMergeState({
      visible: false,
    });
    setTimeout(() => {
      setMergeState({
        data: {},
      });
    }, 800);
  }, []);
  useImperativeHandle(
    ref,
    () => {
      return {
        show: (outData) => {
          if (outData && outData.type) {
            const { botName: modelName } = strasMap.get(Number(outData.type));
            // 先把之前的model数据值空
            dispatch({
              type: `${modelName}/initFirstLoading`,
            });

            setMergeState({
              visible: true,
              data: outData,
            });
          }
        },
        close: onClose,
      };
    },
    [],
  );
  if (!data.type) {
    return null;
  }
  return (
    <ErrorBoundary>
      <DetailModal visible={visible} data={data} onClose={onClose} {...props} />
    </ErrorBoundary>
  );
});

export default ControlRef;
