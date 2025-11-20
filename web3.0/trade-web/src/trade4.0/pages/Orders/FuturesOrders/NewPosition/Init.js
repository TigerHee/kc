/*
 * @Owner: Clyne@kupotech.com
 */
import React, { memo } from 'react';
import { useInit } from './hooks/useInit';

const Init = memo(() => {
  useInit('list');
  return <></>;
});

export default Init;
