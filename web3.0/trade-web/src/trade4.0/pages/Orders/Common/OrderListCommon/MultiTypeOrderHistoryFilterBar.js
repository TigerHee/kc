/**
 * Owner: harry@kupotech.com
 */
import React, { Fragment, useMemo } from 'react';
import { includes } from 'lodash';
import { useSelector } from 'dva';
import SvgComponent from '@/components/SvgComponent';
import { useTradeType } from 'src/trade4.0/hooks/common/useTradeType';
import { FUTURES } from 'src/trade4.0/meta/const';
import { useOrderListFilterData } from '../hooks/useOrderListInit';
import HideOtherPairsRadio from '../HideOtherPairsRadio';
import TradeTypesSelect from '../TradeTypesSelect';
import SymbolFliterRadio from '../SymbolFliterRadio';
import {
  DividerWrapper,
  Left,
  MultiFilterContentWrap,
  MultiTypeOrderHistoryFilterBarWrap,
} from './style';

const keyMap = {
  orderHistory: 'orderHistory',
  orderDealDetail: 'tradeHistory',
};

const MultiTypeOrderHistoryFilterBar = ({
  screen,
  active,
  namespace,
  handleFilterShow,
  futuresType,
  'data-inspector': dataInspector,
  tabContentNode,
}) => {
  const isLogin = useSelector((state) => state.user.isLogin);
  const { hasFilter } = useOrderListFilterData({ namespace });
  const tradeType = useTradeType();
  const isFutures = tradeType === FUTURES;
  const sensorKey = useMemo(() => {
    return keyMap[namespace];
  }, [namespace]);

  const RadioComp = useMemo(() => {
    if (isFutures) {
      return <SymbolFliterRadio dataKey={futuresType} />;
    }
    return <HideOtherPairsRadio namespace={namespace} active={active} sensorKey={sensorKey} />;
  }, [isFutures, futuresType, namespace, active, sensorKey]);

  const breakPoint = ['sm', 'md', 'lg', 'lg1'];

  return (
    <MultiTypeOrderHistoryFilterBarWrap data-inspector={dataInspector}>
      <Left>
        <div className="left">
          <TradeTypesSelect sensorKey={sensorKey} />
          <DividerWrapper type="vertical" />
          {tabContentNode}
        </div>
        {!includes(breakPoint, screen) && <div className="right">{RadioComp}</div>}
      </Left>
      {includes(breakPoint, screen) && (
        <MultiFilterContentWrap>
          {RadioComp}

          {!isFutures && isLogin ? (
            <Fragment>
              <SvgComponent
                type="essential"
                fileName="orders"
                size={12}
                onClick={handleFilterShow}
                className={hasFilter ? 'active' : ''}
              />
            </Fragment>
          ) : null}
        </MultiFilterContentWrap>
      )}
    </MultiTypeOrderHistoryFilterBarWrap>
  );
};

export default MultiTypeOrderHistoryFilterBar;
