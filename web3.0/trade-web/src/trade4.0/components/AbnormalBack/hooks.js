/**
 * Owner: garuda@kupotech.com
 */
import { useCallback } from 'react';

import { useSelector } from 'react-redux';

import { isNaN } from 'lodash';

import { ABC_TYPE_CROSS, ABC_TYPE_SETTING } from './constant';

export const useShowAbnormal = () => {
  const crossAbnormal = useSelector((state) => state.futuresCommon.crossAbnormal);
  const showAbnormal = useCallback(
    ({ value = '', requiredKeys, type = ABC_TYPE_CROSS, placeholder = '--' } = {}) => {
      if (value == null || isNaN(value)) {
        return placeholder;
      }
      let regKeys = requiredKeys;
      if (!requiredKeys) {
        regKeys = ABC_TYPE_SETTING[type];
      }
      if (typeof regKeys === 'string') {
        regKeys = [regKeys];
      }
      const regResult = regKeys?.every((item) => crossAbnormal[item]);
      if (regResult) {
        return value;
      }
      return placeholder;
    },
    [crossAbnormal],
  );

  return showAbnormal;
};

export const useGetAbnormal = () => {
  return useSelector((state) => state.futuresCommon.crossAbnormal);
};
