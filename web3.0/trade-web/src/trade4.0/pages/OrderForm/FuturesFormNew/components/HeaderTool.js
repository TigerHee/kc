/**
 * Owner: garuda@kupotech.com
 */

import React, { memo } from 'react';

import KuxDivider from '@mui/Divider';

import Calculator from './Calculator';
import ConfigLeverage from './ConfigLeverage';

import { styled } from '../builtinCommon';
import { MarginModeSelect, NewGuide } from '../builtinComponents';
import { isOpenFuturesCross } from '../builtinHooks';
import { useGetIsLogin, useGetSymbolInfo } from '../hooks/useGetData';

const Divider = styled(KuxDivider)`
  margin: 0 8px;
`;

const HeaderBar = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const OperatorLevBox = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 8px;
  height: 28px;
  margin-right: 8px;
  width: 100%;
  background: ${(props) => props.theme.colors.cover4};
  border-radius: 8px;
  user-select: none;
  .tool-button {
    display: flex;
    flex: 1;
    justify-content: center;
    height: 100%;
  }
`;

const GuidePlaceHolder = styled.div`
  position: relative;
  width: 1px;
  height: 1px;
  top: 0px;
  z-index: -1;
`;

const NewGuideMarginMode = memo(() => {
  const isLogin = useGetIsLogin();
  return (
    <NewGuide defaultOpen={isLogin} path="/trade" type="margin-mode" pos={0} placement="left">
      <GuidePlaceHolder />
    </NewGuide>
  );
});

const HeaderTool = () => {
  const { symbol } = useGetSymbolInfo();
  const isLogin = useGetIsLogin();
  return (
    <HeaderBar className="futures-header-bar">
      {isOpenFuturesCross() ? <NewGuideMarginMode /> : null}
      <OperatorLevBox>
        <MarginModeSelect symbol={symbol} className="tool-button" />
        <NewGuide
          defaultOpen={isLogin}
          path="/trade"
          type="leverage-setting"
          pos={0}
          placement="left"
        >
          <Divider type="vertical" />
        </NewGuide>
        <ConfigLeverage className="tool-button" />
      </OperatorLevBox>
      <Calculator />
    </HeaderBar>
  );
};

export default memo(HeaderTool);
