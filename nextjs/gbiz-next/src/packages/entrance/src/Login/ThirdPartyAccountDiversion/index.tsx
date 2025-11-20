/**
 * Owner: sean.shi@kupotech.com
 */
import React, { useCallback } from 'react';
import clsx from 'clsx';
import { Box } from '@kux/mui';
import { AccountDiversion } from './AccountDiversion';
import { CreateNewAccount } from './CreateNewAccount';
import { BindExistAccount } from './BindExistAccount';
import { ExistAccountLogin } from './ExistAccountLogin';
import { AccountHasBound } from './AccountHasBound';
import { Back } from '../../components/Back';
import { THIRD_PARTY_ACCOUNT_DIVERSION_STEP } from '../constants';
import { useLoginStore } from '../model';
import styles from './index.module.scss';

interface ThirdPartyAccountDiversionProps {
  theme?: any;
  onSuccess: (data: any) => void;
  trackingConfig?: Record<string, any>;
  onForgetPwdClick?: () => void;
  onBack?: () => void;
  noLayout?: boolean;
  withDrawer?: boolean;
}

const ThirdPartyAccountDiversion: React.FC<ThirdPartyAccountDiversionProps> = ({
  theme,
  onSuccess,
  trackingConfig,
  onForgetPwdClick,
  onBack,
  noLayout,
  withDrawer,
}) => {
  // zustand 替换 redux
  const thirdPartyDiversionStep = useLoginStore(state => state.thirdPartyDiversionStep);
  const update = useLoginStore(state => state.update);
  const thirdPartyRebackStep = useLoginStore(state => state.thirdPartyRebackStep);
  const thirdPartyNextStep = useLoginStore(state => state.thirdPartyNextStep);

  // 返回
  const goBack = useCallback(() => {
    // 返回就要把是绑定还是换绑参数的重置，只要后续重新进入都会在具体 case 下设置
    update?.({
      loginDecision: undefined,
    });
    thirdPartyRebackStep?.(onBack);
  }, [thirdPartyRebackStep, onBack]);

  // 创建新账户
  const handleNewAccount = useCallback(() => {
    thirdPartyNextStep?.(THIRD_PARTY_ACCOUNT_DIVERSION_STEP.CREATE_NEW_ACCOUNT);
  }, [thirdPartyNextStep]);

  // 输入已有账号
  const handleBindExistAccount = useCallback(() => {
    thirdPartyNextStep?.(THIRD_PARTY_ACCOUNT_DIVERSION_STEP.BIND_EXIST_ACCOUNT);
  }, [thirdPartyNextStep]);

  // 账号已经被绑定
  const handleAccountHasBound = useCallback(() => {
    thirdPartyNextStep?.(THIRD_PARTY_ACCOUNT_DIVERSION_STEP.ACCOUNT_HAS_BOUND);
  }, [thirdPartyNextStep]);

  // 已有账号登陆
  const handleExistAccountLogin = useCallback(() => {
    update?.({
      loginErrorCode: null,
      loginErrorTip: undefined,
    });
    thirdPartyNextStep?.(THIRD_PARTY_ACCOUNT_DIVERSION_STEP.EXIST_ACCOUNT_LOGIN);
  }, [update, thirdPartyNextStep]);

  return (
    <Box className={clsx(styles.contentBox)} data-no-layout={noLayout} data-with-drawer={withDrawer}>
      {/* 创建新账号时使用注册组件里面的回退 */}
      {thirdPartyDiversionStep === THIRD_PARTY_ACCOUNT_DIVERSION_STEP.CREATE_NEW_ACCOUNT ? null : (
        <Back onBack={goBack} />
      )}

      {/* 分流页 */}
      {thirdPartyDiversionStep === THIRD_PARTY_ACCOUNT_DIVERSION_STEP.HOME && (
        <AccountDiversion
          handleNewAccount={handleNewAccount}
          handleBindExistAccount={handleBindExistAccount}
        />
      )}
      {/* 三方账号 注册新 kc 账号 */}
      {thirdPartyDiversionStep === THIRD_PARTY_ACCOUNT_DIVERSION_STEP.CREATE_NEW_ACCOUNT && (
        <CreateNewAccount
          theme={theme}
          trackingConfig={trackingConfig}
          onSuccess={onSuccess}
          handleExistAccountLogin={handleExistAccountLogin}
          handleAccountHasBound={handleAccountHasBound}
          onBack={goBack}
        />
      )}
      {/* 绑定已存在的账号 */}
      {thirdPartyDiversionStep === THIRD_PARTY_ACCOUNT_DIVERSION_STEP.BIND_EXIST_ACCOUNT && (
        <BindExistAccount
          handleNewAccount={handleNewAccount}
          handleExistAccountLogin={handleExistAccountLogin}
          handleAccountHasBound={handleAccountHasBound}
        />
      )}
      {/* 账号已被绑定，直接登陆/换绑 */}
      {thirdPartyDiversionStep === THIRD_PARTY_ACCOUNT_DIVERSION_STEP.ACCOUNT_HAS_BOUND && (
        <AccountHasBound
          handleExistAccountLogin={handleExistAccountLogin}
        />
      )}
      {/* 登陆已存在的账号 */}
      {thirdPartyDiversionStep === THIRD_PARTY_ACCOUNT_DIVERSION_STEP.EXIST_ACCOUNT_LOGIN && (
        <ExistAccountLogin

          trackingConfig={trackingConfig}
          onSuccess={onSuccess}
          onForgetPwdClick={onForgetPwdClick}
        />
      )}
    </Box>
  );
};

export default ThirdPartyAccountDiversion;