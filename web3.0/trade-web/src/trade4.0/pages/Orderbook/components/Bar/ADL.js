/*
 * owner: Clyne@kupotech.com
 */
import React from 'react';
import { map } from 'lodash';
import { useSelector } from 'dva';
import { namespace } from '@/pages/Orderbook/config';
import { useTradeType } from '@/hooks/common/useTradeType';
import {
  ADLWrapper,
  Primary,
  Complementary,
  Secondary,
  ADLDefault,
} from './style';
import { MARGIN, SPOT, ISOLATED } from '@/meta/const';

const getPlaceholder = (percent, len) => {
  let str = (percent || '').replace('%', '');
  str /= 100;
  return Math.ceil(str * len);
};

const place = 5;

const textMap = {
  1: Primary,
  2: Primary,
  3: Complementary,
  4: Secondary,
  5: Secondary,
};

const ADL = () => {
  const adlPct = useSelector((state) => state[namespace].adlPct);
  const tradeType = useTradeType();
  if (tradeType === SPOT || tradeType === MARGIN || tradeType === ISOLATED) {
    return null;
  }
  const placeholder = getPlaceholder(adlPct, place);
  return (
    <ADLWrapper className="orderbook-adl">
      {map(new Array(5), (_, idx) => {
        let active = true;
        if (idx + 1 > placeholder) {
          active = false;
        }

        const Text = active ? textMap[placeholder] : ADLDefault;
        return <Text key={idx} />;
      })}
    </ADLWrapper>
  );
};

export default ADL;
