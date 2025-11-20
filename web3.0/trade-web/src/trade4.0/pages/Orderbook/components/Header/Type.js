/*
 * owner: Clyne@kupotech.com
 */
import React from 'react';
import { map } from 'lodash';
import { useSelector, useDispatch } from 'dva';
import storage from 'src/utils/storage';
// import BuyIcon from '@/assets/orderbook/buy.svg';
// import BuyActiveIcon from '@/assets/orderbook/buy-active.svg';
// import BothIcon from '@/assets/orderbook/both.svg';
// import BothActiveIcon from '@/assets/orderbook/both-active.svg';
// import SellIcon from '@/assets/orderbook/sell.svg';
// import SellActiveIcon from '@/assets/orderbook/sell-active.svg';
import { BothIcon, BothActiveIcon, BuyIcon, BuyActiveIcon, SellIcon, SellActiveIcon } from './Icon';
import {
  ORDER_BOOK_ALL,
  ORDER_BOOK_BUY,
  ORDER_BOOK_SELL,
  namespace,
  ORDER_BOOK_TYPE_STORAGE_KEY,
} from '@/pages/Orderbook/config';
import { TypeWrapper, TypeIcon } from './style';
import { commonSensorsFunc } from '@/meta/sensors';
import { resetScroll } from '../List/hooks/useList';

const config = [
  {
    type: ORDER_BOOK_ALL,
    Icon: BothIcon,
    ActiveIcon: BothActiveIcon,
  },
  {
    type: ORDER_BOOK_SELL,
    Icon: SellIcon,
    ActiveIcon: SellActiveIcon,
    sensors: () => {
      commonSensorsFunc(['orderBook', 'orderBookSellOnly', 'click']);
    },
  },
  {
    type: ORDER_BOOK_BUY,
    Icon: BuyIcon,
    ActiveIcon: BuyActiveIcon,
    sensors: () => {
      commonSensorsFunc(['orderBook', 'orderBookBuyOnly', 'click']);
    },
  },
];

const Type = () => {
  const dispatch = useDispatch();
  const currentMode = useSelector((state) => state[namespace].type);
  // onChange
  const onChange = (e, type, sensors) => {
    if (e && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }
    dispatch({
      type: '$orderbook/update',
      payload: {
        type,
      },
    });
    // 更新缓存
    storage.setItem(ORDER_BOOK_TYPE_STORAGE_KEY, type);
    resetScroll();
    sensors();
  };

  return (
    <TypeWrapper className="orderbook-type">
      {map(config, ({ Icon, ActiveIcon, type, sensors = () => {} }) => {
        const CompIcon = type === currentMode ? ActiveIcon : Icon;
        return (
          <TypeIcon key={type} onClick={(e) => onChange(e, type, sensors)}>
            <CompIcon />
            {/* <img src={type === currentMode ? ActiveIcon : Icon} alt="" /> */}
          </TypeIcon>
        );
      })}
    </TypeWrapper>
  );
};

export default Type;
