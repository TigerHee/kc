/*
 * @owner: mike@kupotech.com
 */
import { isBotTradeByPathname } from '@/meta/tradeTypes';
import { evtEmitter } from 'helper';
import debounce from 'lodash/debounce';
import { BotInitState } from 'Bot/components/PreloaderWrapper';

const startListen = debounce((callback) => {
  console.log('startListen');
  evtEmitter.getEvt('bot').on('modelMount', callback);
}, 100);

/**
 * @description: 初始化策略类型, 必须要放到初始化全局交易对之后
 * @param {*} pathname
 * @return {*}
 */
export const initStrategy = ({ pathname, dispatch, currentSymbol }) => {
  const isBotTrade = isBotTradeByPathname(pathname);
  if (!isBotTrade) {
    return;
  }
  const setStrategy = () => {
    console.log('setStrategy');
    dispatch({
      type: 'BotStatus/initStrategy',
      payload: {
        currentSymbol,
      },
    });
  };

  // 初始化哪种策略
  if (BotInitState.modelMount) {
    setStrategy();
  } else {
    startListen(setStrategy);
  }
};
