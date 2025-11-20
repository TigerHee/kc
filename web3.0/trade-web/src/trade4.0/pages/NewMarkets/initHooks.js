/*
 * @Owner: Clyne@kupotech.com
 */
import React, { memo } from 'react';
import { useInit, useInitEvent } from './hooks/useInit';

const InitEvent = memo(() => {
  useInitEvent();
  return <></>;
});

const InitHook = () => {
  useInit();
  return (
    <>
      <InitEvent />
    </>
  );
};

export default InitHook;
