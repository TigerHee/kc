/**
 * Owner: garuda@kupotech.com
 */
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { get } from 'lodash';

import Button from '@mui/Button';
import Spin from '@mui/Spin';

import { maintenanceText, PASSWORD_SECURITY_TYPE, getText } from './config';

import { styled, _t, siteCfg, addLangToPath, getMainsiteLink } from '../../builtinCommon';
import { useGetUserOpenFutures, useOpenFuturesDialog, useLoginDrawer } from '../../builtinHooks';

// import ButtonTip from './ButtonTip';

import { BUY, useFuturesForm } from '../../config';
import { useGetIsLogin, useGetSymbolInfo, useGetUserInfo } from '../../hooks/useGetData';
import useWrapperScreen from '../../hooks/useWrapperScreen';
import { tradeButtonOtherSensors } from '../../utils';

const BtnGroupWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  .KuxButton-root {
    margin-bottom: 8px;
  }
`;

const BtnWrapper = styled.div`
  width: 100%;
`;

const TipLabel = styled.span`
  margin: 16px 0 0;
  display: flex;
  justify-content: center;
  text-align: center;
  font-size: 12px;
  line-height: 18px;
  color: ${(props) => props.theme.colors.text60};
`;

const useTradeButtonProps = () => {
  const dispatch = useDispatch();
  const { symbolInfo } = useGetSymbolInfo();
  const { securityStatus, isOpen } = useGetUserInfo();
  const isLogin = useGetIsLogin();
  const isOpenFutures = useGetUserOpenFutures();
  const [openFutures] = useOpenFuturesDialog();
  const futuresFormContext = useFuturesForm();
  const { open } = useLoginDrawer();

  const currentContractState = symbolInfo?.status;

  const errorStateText = getText(currentContractState, _t);
  const hasSetPassword = get(securityStatus, PASSWORD_SECURITY_TYPE);

  const handleSignUp = useCallback(() => {
    window.location.href = addLangToPath(
      `${siteCfg.MAIN_KUCOIN_HOST}/ucenter/signup?backUrl=${encodeURIComponent(
        window.location.href,
      )}`,
    );
  }, []);

  // TIPS: 交易大厅跟专业版的处理逻辑不同
  const handleSetPwd = useCallback(() => {
    window.location.href = getMainsiteLink().assetPwdUrl;
    // 埋点
    tradeButtonOtherSensors('setPwd');
  }, []);

  // 点击开通合约
  const handleOpenFutures = useCallback(() => {
    openFutures && openFutures();
    // 埋点
    tradeButtonOtherSensors('openFutures');
  }, [openFutures]);

  return {
    dispatch,
    isLogin,
    isOpen,
    hasSetPassword,
    currentContractState,
    errorStateText,
    futuresFormContext,
    handleLogin: open,
    handleSignUp,
    handleSetPwd,
    isOpenFutures,
    openFutures,
  };
};

const SingleFormTradeButton = ({ children }) => {
  const {
    isLogin,
    isOpen,
    hasSetPassword,
    currentContractState,
    errorStateText,
    handleLogin,
    handleSetPwd,
    handleSignUp,
    isOpenFutures,
    openFutures,
  } = useTradeButtonProps();

  if (!isLogin) {
    return (
      <BtnGroupWrapper>
        <BtnWrapper>
          <Button onClick={handleLogin} fullWidth>
            {_t('login')}
          </Button>
        </BtnWrapper>
        <BtnWrapper>
          <Button onClick={handleSignUp} fullWidth type="default">
            {_t('register')}
          </Button>
        </BtnWrapper>
      </BtnGroupWrapper>
    );
  }

  if (errorStateText) {
    const showType = !['PrepareSettled', 'BeingSettled'].includes(currentContractState);
    return (
      <BtnWrapper>
        <Button fullWidth variant="contained" disabled>
          <span>{errorStateText}</span>
        </Button>
        {showType ? (
          <TipLabel>{_t(maintenanceText[currentContractState.toUpperCase()])}</TipLabel>
        ) : null}
      </BtnWrapper>
    );
  }

  if (isOpen !== undefined && !isOpenFutures) {
    return (
      <BtnWrapper>
        <Button fullWidth onClick={openFutures}>
          {_t('trade.notOpened.enable')}
        </Button>
      </BtnWrapper>
    );
  }

  if (isOpen === undefined || hasSetPassword === undefined) {
    return (
      <BtnWrapper>
        <Spin spinning />
      </BtnWrapper>
    );
  }

  if (!hasSetPassword) {
    return (
      <BtnWrapper>
        <Button variant="contained" color="primary" fullWidth onClick={handleSetPwd}>
          {_t('security.setPassWord')}
        </Button>
      </BtnWrapper>
    );
  }

  return children;
};

const PluralFormTradeButton = ({ children }) => {
  const {
    futuresFormContext,
    isLogin,
    isOpen,
    hasSetPassword,
    errorStateText,
    handleLogin,
    handleSignUp,
  } = useTradeButtonProps();
  const isBuy = futuresFormContext?.side === BUY;

  // console.log('plural from --->', futuresFormContext?.side);

  if (!isLogin) {
    return (
      <BtnWrapper>
        <Button
          onClick={isBuy ? handleLogin : handleSignUp}
          fullWidth
          type={isBuy ? 'primary' : 'default'}
        >
          {_t(isBuy ? 'login' : 'register')}
        </Button>
      </BtnWrapper>
    );
  }

  if (!isOpen || !hasSetPassword || errorStateText) {
    return null;
  }

  return children;
};

const TradeButton = (props) => {
  const { children } = props;
  const { isMd } = useWrapperScreen();
  return isMd ? (
    <PluralFormTradeButton>{children}</PluralFormTradeButton>
  ) : (
    <SingleFormTradeButton>{children}</SingleFormTradeButton>
  );
};

// 专门为宽屏双表单单独写一份按钮
export const PluralFormNotTradeButton = () => {
  const {
    isLogin,
    isOpen,
    hasSetPassword,
    currentContractState,
    errorStateText,
    handleSetPwd,
    isOpenFutures,
    openFutures,
  } = useTradeButtonProps();

  if (!isLogin) {
    return null;
  }

  if (errorStateText) {
    const showType = !['PrepareSettled', 'BeingSettled'].includes(currentContractState);
    return (
      <BtnWrapper>
        <Button fullWidth variant="contained" disabled>
          <span>{errorStateText}</span>
        </Button>
        {showType ? (
          <TipLabel>{_t(maintenanceText[currentContractState.toUpperCase()])}</TipLabel>
        ) : null}
      </BtnWrapper>
    );
  }

  if (isOpen !== undefined && !isOpenFutures) {
    return (
      <BtnWrapper>
        <Button fullWidth onClick={openFutures}>
          {_t('trade.notOpened.enable')}
        </Button>
      </BtnWrapper>
    );
  }

  if (isOpen === undefined || hasSetPassword === undefined) {
    return (
      <BtnWrapper>
        <Spin spinning />
      </BtnWrapper>
    );
  }

  if (!hasSetPassword) {
    return (
      <BtnWrapper>
        <Button variant="contained" color="primary" fullWidth onClick={handleSetPwd}>
          {_t('security.setPassWord')}
        </Button>
      </BtnWrapper>
    );
  }

  return null;
};

export default React.memo(TradeButton);
