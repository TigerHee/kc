/**
 * Owner: sean.shi@kupotech.com
 */
import { styled, Box } from '@kux/mui';
import { useDispatch, useSelector } from 'react-redux';
import { AccountDiversion } from './AccountDiversion';
import { CreateNewAccount } from './CreateNewAccount';
import { BindExistAccount } from './BindExistAccount';
import { ExistAccountLogin } from './ExistAccountLogin';
import { AccountHasBound } from './AccountHasBound';
import { Back } from '../../components/Back';
import { NAMESPACE, THIRD_PARTY_ACCOUNT_DIVERSION_STEP } from '../constants';

const ContentBox = styled(Box)`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const ThirdPartyAccountDiversion = ({
  theme,
  onSuccess,
  trackingConfig,
  onForgetPwdClick,
  onBack,
  noLayout,
  withDrawer,
}) => {
  const { thirdPartyDiversionStep } = useSelector((state) => state[NAMESPACE]);
  const dispatch = useDispatch();
  // 返回
  const goBack = () => {
    dispatch({ type: `${NAMESPACE}/thirdPartyRebackStep`, onBack });
  };
  // 创建新账户
  const handleNewAccount = () => {
    dispatch({
      type: `${NAMESPACE}/thirdPartyNextStep`,
      payload: {
        nextStep: THIRD_PARTY_ACCOUNT_DIVERSION_STEP.CREATE_NEW_ACCOUNT,
      },
    });
  };
  // 输入已有账号
  const handleBindExistAccount = () => {
    dispatch({
      type: `${NAMESPACE}/thirdPartyNextStep`,
      payload: {
        nextStep: THIRD_PARTY_ACCOUNT_DIVERSION_STEP.BIND_EXIST_ACCOUNT,
      },
    });
  };
  // 账号已经被绑定
  const handleAccountHasBound = () => {
    dispatch({
      type: `${NAMESPACE}/thirdPartyNextStep`,
      payload: {
        nextStep: THIRD_PARTY_ACCOUNT_DIVERSION_STEP.ACCOUNT_HAS_BOUND,
      },
    });
  };
  // 已有账号登陆
  const handleExistAccountLogin = () => {
    dispatch({
      type: `${NAMESPACE}/update`,
      payload: {
        // 进入到登陆已有账号时，清除错误信息
        loginErrorCode: null,
        loginErrorTip: null,
      },
    });
    dispatch({
      type: `${NAMESPACE}/thirdPartyNextStep`,
      payload: {
        nextStep: THIRD_PARTY_ACCOUNT_DIVERSION_STEP.EXIST_ACCOUNT_LOGIN,
      },
    });
  };
  return (
    <ContentBox noLayout={noLayout} withDrawer={withDrawer}>
      {/* 创建新账号时使用注册组件里面的回退 */}
      {thirdPartyDiversionStep === THIRD_PARTY_ACCOUNT_DIVERSION_STEP.CREATE_NEW_ACCOUNT ? null : (
        <Back onBack={goBack} />
      )}

      {/* 分流页 */}
      {thirdPartyDiversionStep === THIRD_PARTY_ACCOUNT_DIVERSION_STEP.HOME && (
        <AccountDiversion
          onBack={onBack}
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
          theme={theme}
          trackingConfig={trackingConfig}
          onSuccess={onSuccess}
          handleNewAccount={handleNewAccount}
          handleExistAccountLogin={handleExistAccountLogin}
          handleAccountHasBound={handleAccountHasBound}
        />
      )}
      {/* 账号已被绑定，直接登陆/换绑 */}
      {thirdPartyDiversionStep === THIRD_PARTY_ACCOUNT_DIVERSION_STEP.ACCOUNT_HAS_BOUND && (
        <AccountHasBound
          theme={theme}
          trackingConfig={trackingConfig}
          onSuccess={onSuccess}
          handleExistAccountLogin={handleExistAccountLogin}
        />
      )}
      {/* 登陆已存在的账号 */}
      {thirdPartyDiversionStep === THIRD_PARTY_ACCOUNT_DIVERSION_STEP.EXIST_ACCOUNT_LOGIN && (
        <ExistAccountLogin
          theme={theme}
          trackingConfig={trackingConfig}
          onSuccess={onSuccess}
          onForgetPwdClick={onForgetPwdClick}
        />
      )}
    </ContentBox>
  );
};

export default ThirdPartyAccountDiversion;
