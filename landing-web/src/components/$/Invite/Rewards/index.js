/**
 * Owner: terry@kupotech.com
 */
import React, { useRef, useEffect } from 'react';
import { debounce } from 'lodash';
import MainCoupon from './MainCoupon';
import LotteryCoupon from './LotteryCoupon';
import Marquee from './Marquee';
import {
  RewardsContent,
} from '../styles';

const syncLabel = debounce((tag1, tag2) => {
  try {
    if (!tag1 || !tag2) return;
    const _height = Math.max(tag1.clientHeight, tag2.clientHeight);
    if (!_height) return;
    [tag1, tag2].forEach((el) => {
      el.style.height = `${_height}px`;
    });
  } catch (e) {
    console.error(e);
  }
}, 200, { leading: false, trailing: true });

const Rewards = () => {

  const tag1 = useRef();
  const tag2 = useRef();

  useEffect(() => {
    syncLabel(tag1.current, tag2.current);
  }, []);

  return (
    <>
      <RewardsContent>
        {/* 必得奖励 */}
        <MainCoupon tagRef={ref => tag1.current = ref } />
        {/* 抽奖可获得的奖励 */}
        <LotteryCoupon tagRef={ref => tag2.current = ref } />
      </RewardsContent>
      <Marquee />
    </>
  )
};

export default Rewards;