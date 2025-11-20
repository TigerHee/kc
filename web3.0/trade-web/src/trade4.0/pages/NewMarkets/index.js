/*
 * @Owner: Clyne@kupotech.com
 */
import React, { memo, useEffect } from 'react';
import ComponentWrapper from '@/components/ComponentWrapper';
import {
  ALL_OPTIONS,
  LIST_TYPE,
  MARKET_INIT_EVENT,
  name,
  namespace,
  SwitchContext,
} from './config';
import { Wrapper } from './style';
import Search from './components/Search';
import MarketTabs from './components/MarketTabs';
import Content from './components/Content';
import { useInitFloat } from './hooks/useInit';
import { commonSensors } from 'src/trade4.0/meta/sensors';
import { event } from 'src/trade4.0/utils/event';
import { getStore } from 'src/utils/createApp';
import { useDispatch } from 'dva';

export default memo(({ isFloat, isSwitch }) => {
  useInitFloat(isFloat);
  const dispatch = useDispatch();
  useEffect(() => {
    const { nav } = getStore().getState()[namespace];
    commonSensors.newMarkets.marketExpose.click();
    if (!isSwitch) {
      event.emit(MARKET_INIT_EVENT);
    } else {
      nav[LIST_TYPE.SEARCH].active = ALL_OPTIONS.value;
      dispatch({
        type: `${namespace}/update`,
        payload: { nav },
      });
    }
  }, [dispatch, isSwitch]);
  return (
    <SwitchContext.Provider value={isSwitch}>
      <ComponentWrapper name={name} breakPoints={[400, 1000]}>
        <Wrapper className="markets">
          <Search />
          <MarketTabs />
          <Content isSwitch={isSwitch} />
        </Wrapper>
      </ComponentWrapper>
    </SwitchContext.Provider>
  );
});
