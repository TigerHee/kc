/**
 * Owner: willen@kupotech.com
 */
import { useMemo } from 'react';
import { I18nManager } from 'react-native';
import colors from './colors';

export default (themeType, cstyle, options = {}) => {
  return useMemo(() => {
    const color = colors[themeType];
    const colorV2 = colors[`${themeType}V2`];
    return {
      type: themeType,
      color,
      colorV2: {
        ...colorV2,
        chartUpColor: cstyle ? colorV2.primary : colorV2.secondary,
        chartDownColor: cstyle ? colorV2.secondary : colorV2.primary,
      },
      cstyle, // true-绿涨红跌，false-红涨绿跌
      isRTL: I18nManager.isRTL,
      options,
    };
  }, [themeType, options]);
};
