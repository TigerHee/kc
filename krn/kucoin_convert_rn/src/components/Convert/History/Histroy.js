/**
 * Owner: willen@kupotech.com
 */
import React, {useState} from 'react';
import styled from '@emotion/native';
import {Tabs} from '@krn/ui';
import useLang from 'hooks/useLang';
import {TRADE_TYPE_LIST} from '../config';
import HistroyLimit from './HistroyLimit';
import HistroyMarket from './HistroyMarket';
import {useDispatch} from 'react-redux';

const {Tab} = Tabs;

const Wrapper = styled.View`
  padding: 0 16px 16px;
  flex: 1;
`;

const TabsWrapper = styled.View`
  height: 48px;
  flex-direction: row;
  align-items: center;
`;

export default () => {
  const [orderType, setOrderType] = useState(TRADE_TYPE_LIST[0].value);
  const dispatch = useDispatch();
  const {_t} = useLang();

  const List = TRADE_TYPE_LIST.map(item => ({
    ...item,
    label: _t(item.label),
  }));

  const handleTabChange = v => {
    setOrderType(v);
    dispatch({
      type: 'order/update',
      payload: {
        historyOrderType: v,
      },
    });

    dispatch({
      type: 'order/reset',
      payload: {clearList: true},
    });
  };

  return (
    <Wrapper>
      <TabsWrapper>
        <Tabs
          value={orderType}
          variant="border"
          onChange={v => handleTabChange(v)}>
          {List.map(({label, value: _value}) => (
            <Tab label={label} value={_value} key={_value} />
          ))}
        </Tabs>
      </TabsWrapper>

      {orderType === 'LIMIT' ? <HistroyLimit /> : <HistroyMarket />}
    </Wrapper>
  );
};
