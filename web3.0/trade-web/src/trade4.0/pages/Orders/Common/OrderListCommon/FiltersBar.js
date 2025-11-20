/**
 * Owner: jessie@kupotech.com
 */
import React, { Fragment, useMemo } from 'react';
import { includes } from 'lodash';
import { useSelector } from 'dva';
import SvgComponent from '@/components/SvgComponent';
import HideOtherPairsRadio from '../HideOtherPairsRadio';
import TradeTypesSelect from '../TradeTypesSelect';
import { useOrderListFilterData } from '../hooks/useOrderListInit';
import { OrderHeadBarWrapper } from '../style';
import { DividerWrapper, Left } from './style';
import { useTradeType } from 'src/trade4.0/hooks/common/useTradeType';
import { FUTURES } from 'src/trade4.0/meta/const';
import SymbolFliterRadio from '../SymbolFliterRadio';

const keyMap = {
  orderHistory: 'orderHistory',
  orderDealDetail: 'tradeHistory',
};

const FiltersBar = ({
  screen,
  active,
  namespace,
  handleFilterShow,
  futuresType,
  'data-inspector': dataInspector,
}) => {
  const isLogin = useSelector((state) => state.user.isLogin);
  const { hasFilter } = useOrderListFilterData({ namespace });
  const tradeType = useTradeType();
  const isFutures = tradeType === FUTURES;
  const sensorKey = useMemo(() => {
    return keyMap[namespace];
  }, [namespace]);
  return (
    <OrderHeadBarWrapper data-inspector={dataInspector}>
      <Left>
        <TradeTypesSelect sensorKey={sensorKey} />
        {!isFutures && isLogin && includes(['sm', 'md', 'lg', 'lg1'], screen) ? (
          <Fragment>
            <DividerWrapper type="vertical" />
            <SvgComponent
              type="essential"
              fileName="orders"
              size={12}
              onClick={handleFilterShow}
              className={hasFilter ? 'active' : ''}
            />
          </Fragment>
        ) : null}
      </Left>
      {isFutures ? (
        <SymbolFliterRadio dataKey={futuresType} />
      ) : (
        <HideOtherPairsRadio namespace={namespace} active={active} sensorKey={sensorKey} />
      )}
    </OrderHeadBarWrapper>
  );
};

export default FiltersBar;
