/**
 * Owner: terry@kupotech.com
 */
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useSelector } from 'dva';
import { _tHTML } from 'utils/lang';
import { formatNumber } from 'helper';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import find from 'lodash/find';
import {
  MarqueeWrapper,
  MarqueeItem,
} from './styled';
import {
  RewardsInfoWrapper
} from '../styles';


const Marquee = () => {
  const listRef = useRef();
  const [start, updateStart] = useState(false);
  const [scroll, updateScroll] = useState(-1);
  const { broadcastList, activityInfo } = useSelector((state) => state.invite);
  const list = useMemo(() => {
    const prizeList = map(broadcastList, ({ getCouponValue, getCouponSort, userDisplayName } = {}) => {
      const prizeItem = find(activityInfo?.prizeConfigDetails || [], i => i.prizeSort === getCouponSort);
      const { prizeName } = prizeItem || {};
      const isOnlyName = getCouponValue == 0;
      const _value = formatNumber(getCouponValue, 2);
      return ({
        username: userDisplayName,
        prizeNum: isOnlyName ? 0 : `${_value} ${window._BASE_CURRENCY_}`,
        prizeName: isOnlyName ? prizeName || '--' : prizeName || '',
      });
    });
    return map(prizeList, prize => {
      const isOnlyName = prize.prizeNum === 0;
      return {
        txt: _tHTML('i2ZUnFTNMgiAMc2LgqLoK6', {
          username: prize.username,
          prizeNum: isOnlyName ? ' ' : prize.prizeNum || '',
          prizeName: prize.prizeName || '',
        })
      }
    });
  }, [broadcastList, activityInfo]);

  useEffect(() => {
    if (!listRef.current || isEmpty(list)) return;
    setTimeout(() => {
      const width = listRef.current?.parentNode?.clientWidth || 0;
      const scrollWidth = listRef.current.scrollWidth;
      const hasScroll = scrollWidth > width && scrollWidth !== 0 && width !== 0 ? scrollWidth : 0;
      updateScroll(hasScroll);
      if (hasScroll > 0) updateStart(true);
    }, 200);
  }, [listRef.current, list]);

  const displayList = useMemo(() => {
    if (!start) return list;
    return [...list, ...list];
  }, [start, list]);

  const isHidden = !displayList.length || list.length < 10;
  return (
    <RewardsInfoWrapper isHidden={isHidden}>
      <MarqueeWrapper ref={listRef} scrollX={scroll} >
        {!isHidden ? map(displayList, (item, idx) => {
          return (
            <MarqueeItem key={idx} first={idx === 0}>{item.txt}</MarqueeItem>
          )
        }) : null}
      </MarqueeWrapper>
    </RewardsInfoWrapper>
  )
};

export default Marquee;