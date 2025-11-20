/**
 * Owner: clyne@kupotech.com
 */
import React, { memo } from 'react';

import { useTheme } from '@emotion/react';

import guideDark from '@/assets/futures/guide-step-dark.png';
import guideLight from '@/assets/futures/guide-step-light.png';

const Step1 = () => {
  const { currentTheme } = useTheme();
  return (
    <img className="step1" src={currentTheme === 'dark' ? guideDark : guideLight} alt="guide" />
  );
};

export default memo(Step1);
