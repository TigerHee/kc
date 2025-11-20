/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { WrapperContext } from '../config';
import Profits from './components/Main';
import LoginAndLoadingWrapper from '../components/LoginAndLoadingWrapper';

export default React.memo(({ className }) => {
  const screen = React.useContext(WrapperContext);
  return (
    <LoginAndLoadingWrapper screen={screen} type="OnlyLogin">
      <Profits screen={screen} className={className} />
    </LoginAndLoadingWrapper>
  );
});
