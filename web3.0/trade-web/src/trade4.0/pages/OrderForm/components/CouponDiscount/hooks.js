/*
 * owner: solar@kupotech.com
 */

import { useEffect, useState } from 'react';
import { useDispatch } from 'dva';
import isNil from 'lodash/isNil';
import useFee from '../../hooks/useFee';
import { multiply } from 'src/helper';
import { intlFormatNumber } from '@/hooks/common/useIntlFormat';


export function useDiscountRate(userKcsDiscountStatus) {
  const { takerFeeRate = 0, makerFeeRate = 0 } = useFee();
  const dispatch = useDispatch();
  const [enable, setEnable] = useState({
    makerEnable: false,
    takerEnable: false,
  });

  const { makerEnable, takerEnable } = enable;

  const toPercent = (num) => {
    return intlFormatNumber({
      options: { style: 'percent' },
      number: num,
    });
  };

  useEffect(() => {
    if (!isNil(takerFeeRate) && !isNil(makerFeeRate)) {
      dispatch({
        type: 'user/queryKcsEnable',
        payload: {
          takerFeeRate,
          makerFeeRate,
        },
      }).then((data) => {
        const { takerEnable: _takerEnable = false, makerEnable: _makerEnable = false } = data;
        setEnable({
          takerEnable: _takerEnable,
          makerEnable: _makerEnable,
        });
      });
    }
  }, [takerFeeRate, makerFeeRate, dispatch]);
  if (userKcsDiscountStatus) {
    return {
      takerMain: takerEnable ? toPercent(multiply(takerFeeRate, 0.8)) : toPercent(takerFeeRate),
      takerSub: toPercent(takerFeeRate),
      makerMain: makerEnable ? toPercent(multiply(makerFeeRate, 0.8)) : toPercent(makerFeeRate),
      makerSub: toPercent(makerFeeRate),
    };
  } else {
    return {
      takerMain: toPercent(takerFeeRate),
      takerSub: null,
      makerMain: toPercent(makerFeeRate),
      makerSub: null,
    };
  }
}
