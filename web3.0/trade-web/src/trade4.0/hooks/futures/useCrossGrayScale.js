/**
 * Owner: Clyne@kupotech.com
 */
import { useCallback } from 'react';

import { useDispatch } from 'react-redux';

import { useSelector } from 'dva';

export const useCrossGrayScale = () => {
  const dispatch = useDispatch();
  const crossGrey = useSelector((state) => state.grayScale.crossGrey);

  const crossGrayScaleForSymbol = useCallback(
    (symbol) => {
      const data = crossGrey[symbol] || [];
      return data;
    },
    [crossGrey],
  );

  const getCrossGrayScale = useCallback(
    (symbol) => {
      dispatch({
        type: 'grayScale/getCrossGrayScale',
        payload: {
          symbol,
        },
      });
    },
    [dispatch],
  );

  return {
    crossGrey,
    crossGrayScaleForSymbol,
    getCrossGrayScale,
  };
};

export const useCrossGrayScaleReady = () => {
  return useSelector((state) => state.grayScale.crossGreyReady);
};
