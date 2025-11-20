/**
 * Owner: garuda@kupotech.com
 * 返回当前组件的响应式
 */
import { useContext } from 'react';

import { WrapperContext } from '../builtinCommon';

const useWrapperScreen = () => {
  const screen = useContext(WrapperContext);

  const isMd = screen === 'md';
  return {
    screen,
    isMd,
  };
};

export default useWrapperScreen;
