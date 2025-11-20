/*
 * owner: borden@kupotech.com
 */
import React from 'react';
import { isFunction } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { styled, useEventCallback, Tabs, useResponsive } from '@kux/mui';
import { NAMESPACE, ORDER_TYPE, ORDER_TYPE_MAP } from '../config';
import useContextSelector from '../hooks/common/useContextSelector';
import useIsRTL from '../hooks/common/useIsRTL';
import getStore from '../utils/getStore';
import { fromCurrencySelector, toCurrencySelector } from '../models/index';

const { Tab } = Tabs;

/** 样式开始 */
const StyledTabs = styled(Tabs)`
  height: fit-content;
  .KuxTabs-Container {
    padding-top: 0;
  }

  .KuxTabs-scrollButton {
    top: 50%;
    transform: translate(0, -50%);
    padding-top: 0;
    height: auto;
  }
`;

const StyledTab = styled(Tab)`
  font-size: 20px;
  margin-left: 20px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 16px;
    margin-left: 16px;
  }
  font-weight: 400;
  &.KuxTab-selected {
    font-weight: 500;
  }
`;

/** 样式结束 */

const OrderTypeTabs = ({ disabledOrderTypes, ...otherProps }) => {
  const isRTL = useIsRTL();
  const { sm } = useResponsive();
  const dispatch = useDispatch();
  const onTabChange = useContextSelector((state) => state.onTabChange);
  const orderType = useSelector((state) => state[NAMESPACE].orderType);

  const onChange = useEventCallback(async (e, val) => {
    if (isFunction(onTabChange)) {
      const store = await getStore();
      const fromCurrency = fromCurrencySelector(store[NAMESPACE] || {});
      const toCurrency = toCurrencySelector(store[NAMESPACE] || {});
      const symbol = `${fromCurrency}-${toCurrency}`;
      onTabChange(val, { symbol });
    }
    dispatch({ type: `${NAMESPACE}/resetPriceSymbol` });
    const store = await getStore();
    const { getNextSymbol } = ORDER_TYPE_MAP[val];
    const nextSymbol = getNextSymbol(store[NAMESPACE] || {});
    const updateCurrencyEffectName = ORDER_TYPE_MAP[val]?.updateCurrencyEffectName;
    dispatch({
      type: `${NAMESPACE}/${
        nextSymbol && updateCurrencyEffectName ? updateCurrencyEffectName : 'update'
      }`,
      payload: {
        orderType: val,
        ...nextSymbol,
      },
    });
  });

  const tabsVal = orderType;

  return (
    <StyledTabs
      variant="line"
      indicator={false}
      value={tabsVal}
      onChange={onChange}
      size={sm ? 'xlarge' : 'large'}
      direction={isRTL ? 'rtl' : 'ltr'}
      {...otherProps}
    >
      {[
        ...ORDER_TYPE.map(({ value, label }) => {
          if (disabledOrderTypes?.includes(value)) return null;
          return (
            <StyledTab
              key={value}
              value={value}
              label={label()}
              data-inspector={`convert_tab_${value.toLocaleLowerCase()}`}
            />
          );
        }),
      ]}
    </StyledTabs>
  );
};

export default React.memo(OrderTypeTabs);
