/**
 * Owner: garuda@kupotech.com
 */
import React from 'react';

import { ReactComponent as ErrorDarkIcon } from '@/assets/futures/error-dark.svg';
import { ReactComponent as ErrorLightIcon } from '@/assets/futures/error-light.svg';

import { useThemeIsDark } from './hooks';

const ErrorImg = () => {
  const isDark = useThemeIsDark();
  return <>{isDark ? <ErrorDarkIcon /> : <ErrorLightIcon />}</>;
};

export default React.memo(ErrorImg);
