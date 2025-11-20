/**
 * Owner: lori@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useSnackbar } from '@kux/mui';
import { Prompt } from 'components/Account/SecurityForm/Alert';
import UpgradeModal from 'components/UpgradeModal';
import { SUPPORT_BAIDU_FACE } from 'config/base';
import { get, isEqual } from 'lodash';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addLangToPath, _t } from 'tools/i18n';
import compareVersion from 'utils/compareVersion';
import { trackClick } from 'utils/ga';
import ResetSteps from '../ResetSteps';
import SelectType from '../SelectType';
import LoadingPage from '../SelectType/Loading';
import SetNewPhone from '../SetNewPhone';
import { BLOCKIDS, OPRIONTS_PHONE } from './config';

const bizType = 'REBINDING_PHONE';
const namespace = 'rebind_phone';

export default (props) => {
  const { token } = props.match.params;
  const dispatch = useDispatch();
  const isInApp = JsBridge.isApp();
  const { message } = useSnackbar();
  const [showPreStep, setShowPreStep] = useState(true);
  const [allowTypes, setAllowTypes] = useState();
  const {
    securityAllowTypes,
    currentStep,
    loadingSms,
    sendChannel,
    retryAfterSeconds,
    securityMethods,
    status,
  } = useSelector((state) => state[namespace]);
  const { appVersion } = useSelector((state) => state.app);
  const loadingStatus = useSelector((state) => state.loading.effects[`${namespace}/pullStatus`]);
  const loadingTypes = useSelector(
    (state) => state.loading.effects[`${namespace}/getSecurityAllowTypes`],
  );

  useEffect(() => {
    // 查询重置手机状态
    dispatch({
      type: `${namespace}/pullStatus`,
      payload: { bizType, token },
    });
    // 查询用户设置了哪些安全保护措施
    dispatch({
      type: `${namespace}/pullMethods`,
      payload: { token },
    });
    dispatch({ type: `${namespace}/getKycCode` });
  }, [token, dispatch]);

  const nextStep = () => {
    dispatch({
      type: `${namespace}/update`,
      payload: { currentStep: currentStep + 1 },
    });
  };

  // 安全验证第一步的埋点
  const handleSecurityClick = () => {
    const securityBlockId = [...BLOCKIDS].find((b) => isEqual(b[0], securityAllowTypes))?.[1];
    trackClick([securityBlockId, '1']);
    nextStep();
  };

  const sendCode = (address, sendChannel) => {
    return dispatch({
      type: `${namespace}/getValidationCode`,
      payload: {
        bizType,
        sendChannel,
        address,
        token,
      },
      callBack: (msg) => message.info(msg),
    });
  };

  // 点击提交新手机号
  const submitNewPhone = (values) => {
    trackClick(['NewPhoneNumber', '1']);
    dispatch({
      type: `${namespace}/submitNewPhone`,
      payload: {
        ...values,
        token,
      },
    });
  };

  const handleTypeSubmit = (key) => {
    if (key === 'google') {
      window.location.href = addLangToPath('/account/security/phone');
    } else {
      let allowTypes = key;
      if (key === 'google_unavailable') {
        // 谷歌不可用且没有绑定邮箱和交易密码-》进入问题验证
        if (get(securityAllowTypes, '[0].length') === 0) {
          allowTypes = [['self_question']];
        } else {
          allowTypes = securityAllowTypes;
        }
      }
      setShowPreStep(false);
      setAllowTypes(allowTypes);
    }
  };

  /**
   * 暂时下掉 google 验证码重置手机号功能
   * - 此页面只有登录时需要做短信认证并且手机不可用才会路由进来
   * - 由于通过 google 重置手机号需要登录态，逻辑进入死循环
   * - 跟产品 leon 同学沟通后先以最小成本下掉，后续有计划对这个页面的业务功能进行重构
   */
  const hasGoogle = false;
  // const hasGoogle = Boolean(securityMethods?.GOOGLE2FA);

  // 选择安全认证类型数据
  let typeObj = hasGoogle ? OPRIONTS_PHONE.goole : {};
  // 没有开通谷歌且只有交易密码
  if (!hasGoogle && isEqual(securityAllowTypes, [['self_question'], ['withdraw_password']])) {
    typeObj = OPRIONTS_PHONE.trade;
  }

  // app版本过低不支持人脸识别, 提示升级版本
  if (isInApp && appVersion && compareVersion(appVersion, SUPPORT_BAIDU_FACE) < 0) {
    return <UpgradeModal />;
  }

  // 加载信息
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
        pageTitle={_t('selfService.resetPhone')}
        prompt={<Prompt content={<div>{_t('security.24h.limit')}</div>} />}
      />
    );
  }

  return (
    <ResetSteps
      currentStep={currentStep}
      extraSteps={[
        {
          title: _t('phone.bind.new'),
          component: (
            <SetNewPhone
              onCodeSend={sendCode}
              onSubmit={submitNewPhone}
              loading={loadingSms}
              sendChannel={sendChannel}
              retryAfterSeconds={retryAfterSeconds}
            />
          ),
        },
      ]}
      bizType={bizType}
      namespace={namespace}
      nextStep={nextStep}
      onAuthSubmit={submitNewPhone}
      onSecuritySuccess={handleSecurityClick}
      allowTypes={allowTypes || securityAllowTypes || []}
      token={token}
    />
  );
};
