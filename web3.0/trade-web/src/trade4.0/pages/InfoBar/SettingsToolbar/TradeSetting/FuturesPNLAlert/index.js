/**
 * Owner: clyne@kupotech.com
 */
import React, { memo } from 'react';
import { styled } from '@/style/emotion';
import AlertSwitch from './AlertSwitch';
import SymbolSync from './SymbolSync';
import AlertList from './AlertList';
import Add from './Add';
import PNLSetDialog from './PNLSetDialog';
import { useInit } from './hooks/useInit';

const Wrapper = styled.div`
  width: 100%;
  padding: 24px 32px;
`;

const PNLAlert = () => {
  useInit();
  return (
    <Wrapper>
      <AlertSwitch />
      <SymbolSync />
      <AlertList />
      <Add />
      <PNLSetDialog />
    </Wrapper>
  );
};

export default memo(PNLAlert);
