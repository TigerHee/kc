/**
 * Owner: garuda@kupotech.com
 */
import React from 'react';

import { ReactComponent as SuccessDarkIcon } from '@/assets/futures/success-dark.svg';
import { ReactComponent as SuccessLightIcon } from '@/assets/futures/success-light.svg';

import { useThemeIsDark } from './hooks';

const SuccessImg = () => {
  const isDark = useThemeIsDark();
  return <>{isDark ? <SuccessDarkIcon /> : <SuccessLightIcon />}</>;
};

export default React.memo(SuccessImg);
