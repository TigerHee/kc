/**
 * Owner: garuda@kupotech.com
 * 下单切换 tabs 组件
 */

import React from 'react';

import IntroTips from './Introduce/IntroTips';
import TabsSelect from './TabsSelect';

import useOrderTypesProps from '../hooks/useOrderTypesProps';
import useWrapperScreen from '../hooks/useWrapperScreen';

const OrderTypes = ({ className }) => {
  const { screen } = useWrapperScreen();
  const props = useOrderTypesProps(screen);

  return (
    <div className={className}>
      <TabsSelect {...props} />
      <IntroTips />
    </div>
  );
};

export default React.memo(OrderTypes);
