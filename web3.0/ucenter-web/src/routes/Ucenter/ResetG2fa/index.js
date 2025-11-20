/**
 * Owner: lori@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { Alert, styled } from '@kux/mui';
import UpgradeModal from 'components/UpgradeModal';
import { SUPPORT_BAIDU_FACE } from 'config/base';
import { tenantConfig } from 'config/tenant';
import { isEqual } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { _t, _tHTML } from 'tools/i18n';
import compareVersion from 'utils/compareVersion';
import { trackClick } from 'utils/ga';
import ResetSteps from '../ResetSteps';
import SelectType from '../SelectType';
import LoadingPage from '../SelectType/Loading';
import { BLOCKIDS, OPTIONS_GOOGLE } from './config';

export const PromptWrapper = styled.div`
  width: 488px;
  font-size: 14px;
  line-height: 22px;
  color: ${({ theme }) => theme.colors.text40};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 100%;
  }
`;

const Prompt = () => {
  return (
    <Alert
      type="warning"
      showIcon={false}
      description={
        <PromptWrapper>
          <div>1.{_t('e5779574017e4000aab6')}</div>
          <div>
            2.{_tHTML('380046255b5d4000a995', { url: tenantConfig.resetG2fa.referenceUrl })}
          </div>
        </PromptWrapper>
      }
    />
  );
};

const namespace = 'reset_g2fa';
export default (props) => {
  const { token } = props.match.params;
  const dispatch = useDispatch();
  const isInApp = JsBridge.isApp();
  const [showPreStep, setShowPreStep] = useState(true);
  const [allowTypes, setAllowTypes] = useState();
  const { appVersion } = useSelector((state) => state.app);
  const { securityAllowTypes, currentStep, status } = useSelector((state) => state[namespace]);
  const loadingStatus = useSelector((state) => state.loading.effects[`${namespace}/pullStatus`]);
  const loadingTypes = useSelector(
    (state) => state.loading.effects[`${namespace}/getSecurityAllowTypes`],
  );
  const typeArr = [...OPTIONS_GOOGLE].find((item) => isEqual(item[0], securityAllowTypes)) || [];
  const typeObj = typeArr[1] || {};

  useEffect(() => {
    dispatch({
      type: `${namespace}/pullStatus`,
      payload: {
        bizType: 'REBINDING_GOOGLE_2FA',
        token,
      },
    });
    dispatch({ type: `${namespace}/getKycCode` });
  }, [token]);

  // 提交身份验证
  const handleResetG2fa = useCallback(() => {
    dispatch({
      type: `${namespace}/submitAuthentication`,
      payload: { token },
    });
  }, [token]);

  const nextStep = useCallback(() => {
    dispatch({
      type: `${namespace}/update`,
      payload: { currentStep: currentStep + 1 },
    });
  }, [currentStep]);

  // 安全验证点击第一步的埋点
  const handleSecurityClick = useCallback(() => {
    const securityBlockId = [...BLOCKIDS].find((b) => isEqual(b[0], securityAllowTypes))?.[1];
    trackClick([securityBlockId, '1']);
    // 如果是通过手机或  手机+交易密码，验证通过直接重置谷歌
    if (allowTypes?.join().includes('my_sms')) {
      dispatch({
        type: `${namespace}/resetG2fa2`,
        payload: { token },
      });
    } else {
      nextStep();
    }
  }, [allowTypes, securityAllowTypes, nextStep]);

  // 选择验证类型
  const handleTypeSubmit = useCallback((selectedTypes) => {
    setAllowTypes(selectedTypes);
    setShowPreStep(false);
  }, []);

  // app版本过低不支持人脸识别, 提示升级版本
  if (isInApp && appVersion && compareVersion(appVersion, SUPPORT_BAIDU_FACE) < 0) {
    return <UpgradeModal />;
  }

  if (loadingStatus || loadingTypes) {
    return <LoadingPage />;
  }

  // 前置选择验证方式页面
  if (typeObj?.options?.length > 0 && showPreStep && status !== 0) {
    return (
      <SelectType
        blockId={typeObj?.blockId}
        renderOptions={typeObj?.options}
        onSubmit={handleTypeSubmit}
        pageTitle={_t('selfService.resetGoogle')}
        prompt={<Prompt />}
      />
    );
  }

  return (
    <ResetSteps
      currentStep={currentStep}
      bizType="REBINDING_GOOGLE_2FA"
      namespace={namespace}
      nextStep={nextStep}
      onAuthSubmit={handleResetG2fa}
      onSecuritySuccess={handleSecurityClick}
      allowTypes={allowTypes || securityAllowTypes || []}
      prompt={<Prompt />}
      token={token}
    />
  );
};
