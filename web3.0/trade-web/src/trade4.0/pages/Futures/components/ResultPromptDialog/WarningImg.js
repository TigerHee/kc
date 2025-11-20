/**
 * Owner: garuda@kupotech.com
 */
import React from 'react';

import { ReactComponent as WarningDarkIcon } from '@/assets/futures/warning-dark.svg';
import { ReactComponent as WarningLightIcon } from '@/assets/futures/warning-light.svg';

import { useThemeIsDark } from './hooks';

const WarningImg = () => {
  const isDark = useThemeIsDark();
  return <>{isDark ? <WarningDarkIcon /> : <WarningLightIcon />}</>;
};

export default React.memo(WarningImg);
