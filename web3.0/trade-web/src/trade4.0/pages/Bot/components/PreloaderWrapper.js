/**
 * Owner: mike@kupotech.com
 */
import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'dva';
import Spin from '@mui/Spin';
import { styled } from '@/style/emotion';
import BotALLModels, { MF_Need_Models } from 'Bot/Models';
import { getDvaApp } from '@kucoin-base/dva';
import once from 'lodash/once';
import GlobalStyle from './GlobalStyle';
import { evtEmitter } from 'helper';
import { BalanceSocket } from '@/components/SocketSubscribe';
import modelNameConfig from './modelNameConfig';

let hasInitModelFetch = false;
/**
 * @description: 触发获取机器人语言包, 在需要的模块上包裹一下
 * 部分model初始化逻辑也放这里
 * @return {*}
 */
const Preloader = React.memo(({ children, source }) => {
  const isReady = useSelector((state) => state.BotApp.isReady);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!hasInitModelFetch && !isReady) {
      hasInitModelFetch = true;
      dispatch({
        type: 'BotApp/initBotAppData',
        payload: {
          source,
        },
      });
    }
    if (isReady) {
      // 语言包拉取完成标记着， 策略部分初始化完成
      BotInitState.langMount = true;
      // evtEmitter.getEvt('bot').emit('langMount');
    }
  }, [isReady]);

  if (!isReady) {
    const FullHeightSpin = styled(Spin)`
      height: ${source === 'orderCenter' ? '180px' : '100%'};
    `;
    return <FullHeightSpin />;
  }

  return children;
});
/**
 * @description: 策略 语言包、model标记
 * @return {*}
 */
export const BotInitState = {
  modelMount: false,
  langMount: false,
};

const registarModels = once((source) => {
  modelNameConfig.setSource(source);
  const app = getDvaApp();
  const model_will_registar = source === 'orderCenter' ? MF_Need_Models : BotALLModels;
  model_will_registar.forEach((bizModel) => {
    app.model(bizModel);
  });
  BotInitState.modelMount = true;
  evtEmitter.getEvt('bot').emit('modelMount');
});
const useRegistarModels = (source) => {
  useMemo(() => registarModels(source), []);
};
/**
 * @description: 策略模块启动的配件
 * 1.model注册成功
 * 2.全局样式完成
 * 3.语言包拉取成功
 * 4.策略交易对匹配数据拉取成功
 * @return {*}
 */
export default React.memo(({ children, source }) => {
  useRegistarModels(source);

  return (
    <>
      <GlobalStyle />
      {source !== 'orderCenter' && <BalanceSocket />}
      <Preloader source={source}>{children}</Preloader>
    </>
  );
});
