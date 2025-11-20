/**
 * Owner: clyne@kupotech.com
 */
import React, { memo } from 'react';

import guideAnimation from '@/assets/futures/guide.json';

import { LottieProvider } from '../builtinComponents';

const Step2 = () => {
  return <LottieProvider lottieJson={guideAnimation} speed={1} loop />;
};

export default memo(Step2);
