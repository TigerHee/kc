/**
 * Owner: odan.ou@kupotech.com
 */
import React, { memo } from 'react';
import StepComp from './components/Step';
import StepVertical from './components/StepVertical';
/**
 * 集合竞价介绍
 * @param {{
 *  vertical?: boolean,
 *  list: any[]
 * }} props
 */
const Step = (props) => {
  const { vertical = false } = props;
  const params = {
    vertical,
    ...props,
  };
  return vertical ? <StepVertical {...params} /> : <StepComp {...params} />;
};

export default memo(Step);
