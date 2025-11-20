import JsBridge from 'gbiz-next/bridge';
import { Captcha } from 'gbiz-next/captcha';
import { goVerify, goVerifyWithAddress, goVerifyWithToken } from 'gbiz-next/verification';
import { Empty, Modal, toast } from '@kux/design';
import { isEmpty, omit } from 'lodash-es';
import { merge } from 'lodash-es';
import { useEffect, useRef, useState } from 'react';
import { Back } from 'src/components/Account/Security/Back';
import {
  postResetApply,
  pullResetResult,
  pullSecurityItems,
} from 'src/services/ucenter/reset-security';
import { addLangToPath, _t } from 'src/tools/i18n';
import BillVerification from './components/BillVerification';
import BindEmail from './components/BindEmail';
import KycCertVerification from './components/KycCertVerification';
import KycFaceVerification from './components/KycFaceVerification';
import QuestionVerification from './components/QuestionVerification';
import ResetItems from './components/ResetItems';
import ResultFailed from './components/ResultFailed';
import ResultVerifying from './components/ResultVerifying';
import SelectItems from './components/SelectItems';
import {
  APPLY_RESULT_ERRORS,
  OPERATE_TYPES,
  REBIND_TYPES,
  RESET_ITEMS,
  RESET_ITEM_ORDERS,
  RESET_SECURITY_RESULT,
  RESET_SECURITY_SCENES,
  SELECT_ITEM_LIST,
} from './constants';
import * as styles from './styles.module.scss';
import ResetSecurityLayout from '@/components/ResetSecurityLayout';
import ErrorBoundary, { SCENE_MAP } from '@/components/common/ErrorBoundary';
import AppVersionComparison from './components/AppVersionComparison';

const IS_IN_APP = JsBridge.isApp();

function ResetSecurity({ token, address, onRefreshToken }) {
  const [scene, setScene] = useState(RESET_SECURITY_SCENES.INIT);
  const [resetItems, setResetItems] = useState([]);
  const [shouldBindEmail, setShouldBindEmail] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [errorCode, setErrorCode] = useState('');
  const [failedReason, setFailedReason] = useState(null);
  const [optionalList, setOptionalList] = useState([]);
  const email = optionalList.find((item) => item.id === RESET_ITEMS.EMAIL)?.address;
  const phone = optionalList.find((item) => item.id === RESET_ITEMS.PHONE)?.address;
  const verifyResRef = useRef({});
  const [loading, setLoading] = useState(false);
  const [captchaOpen, setCaptchaOpen] = useState(false);

  // 重置邮箱或手机号后，后端会踢登录
  const willLogout =
    resetItems.includes(RESET_ITEMS.EMAIL) || resetItems.includes(RESET_ITEMS.PHONE);

  const handleExist = () => {
    if (!document.referrer) {
      // 没有 referrer 说明已经是路由根页面，直接退出
      if (IS_IN_APP) {
        // app 通过桥退出 webview
        JsBridge.open({
          type: 'func',
          params: { name: 'exit' },
        });
      } else {
        // web 直接跳转首页
        window.location.href = addLangToPath('/');
      }
    } else {
      // 不是根页面，返回上一页
      window.history.go(-1);
    }
  };

  const disabledBack = [RESET_SECURITY_SCENES.SELECT_ITEMS, RESET_SECURITY_SCENES.RESULT_VERIFYING].includes(scene);

  const handleBack = () => {
    setScene(RESET_SECURITY_SCENES.SELECT_ITEMS);
    onRefreshToken?.();
  };

  const handleSelectItems = async ({ items, noEmail }) => {
    setShouldBindEmail(noEmail);
    setLoading(true);
    const bizType = 'RV_RESET_SECURITY';
    const operateType = items
      .sort((a, b) => RESET_ITEM_ORDERS[a] - RESET_ITEM_ORDERS[b])
      .map((item) => OPERATE_TYPES[item])
      .join(',');
    const businessData = { operateType };
    const onSuccess = (res) => {
      setLoading(false);
      setResetItems(items);
      if (res.data.isNeedSelfService) {
        // 需要半自助
        if (res.data.isNeedLiveVerify) {
          // 需要活体，进人脸验证
          setScene(RESET_SECURITY_SCENES.KYC_FACE_VERIFICATION);
        } else {
          // 不需要活体，进证件照验证
          setScene(RESET_SECURITY_SCENES.KYC_CERT_VERIFICATION);
        }
      } else if (res.data.isNeedLiveVerify) {
        // 需要活体，进人脸验证
        setScene(RESET_SECURITY_SCENES.KYC_FACE_VERIFICATION);
      } else if (noEmail) {
        // 不需要半自助和活体，检查是否绑定邮箱，没有则先绑定邮箱
        setScene(RESET_SECURITY_SCENES.BIND_EMAIL);
      } else {
        // 开始重置安全项流程
        setScene(RESET_SECURITY_SCENES.RESET_ITEMS);
      }
      verifyResRef.current = res;
    };
    let controller = null;
    const onUnavailable = () => {
      controller?.close();
      setLoading(false);
    };
    const onCancel = () => setLoading(false);
    try {
      if (address) {
        controller = await goVerifyWithAddress({
          bizType,
          address,
          businessData,
          onSuccess,
          onCancel,
          onUnavailable,
        });
      } else if (token) {
        controller = await goVerifyWithToken({
          bizType,
          token,
          businessData,
          onSuccess,
          onCancel,
          onUnavailable,
        });
      } else {
        controller = await goVerify({
          bizType,
          businessData,
          onSuccess,
          onCancel,
          onUnavailable,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (res) => {
    let data;
    try {
      const { headers, data: payload } = verifyResRef.current;
      let rebind = resetItems
        // 按操作顺序排序
        .sort((a, b) => RESET_ITEM_ORDERS[a] - RESET_ITEM_ORDERS[b])
        .map((item) => REBIND_TYPES[item]);
      if (shouldBindEmail && !rebind.includes(REBIND_TYPES[RESET_ITEMS.EMAIL])) {
        // 需要前置绑定邮箱的，添加邮箱重绑类型
        rebind = [REBIND_TYPES[RESET_ITEMS.EMAIL], ...rebind];
      }
      if (!res.rebindPhone && rebind.includes(REBIND_TYPES[RESET_ITEMS.PHONE])) {
        // 若没有 rebindPhone 字段，代表用户跳错此操作
        // 需要从 rebind 中移除手机号类型
        // 只有手机号允许跳过，其他类型不允许
        rebind = rebind.filter((item) => item !== REBIND_TYPES[RESET_ITEMS.PHONE]);
      }
      const result = await postResetApply({
        headers,
        payload: {
          token,
          rebind,
          channel: 'web',
          ...res,
          ...omit(payload, ['isNeedSelfService', 'isNeedLiveVerify']),
        },
      });
      data = result.data || { status: RESET_SECURITY_RESULT.PROCESSING };
    } catch (error) {
      // 中断流程，不需要查询结果，展示错误信息
      setErrorMsg(error?.msg || error?.message);
      setErrorCode(error?.code);
      setShowErrorModal(true);
      return;
    }
    setErrorCode('');
    setErrorMsg('');
    if ([RESET_SECURITY_RESULT.SUCCESS, RESET_SECURITY_RESULT.AUTO_SUCCESS].includes(data.status)) {
      // 自动通过，展示成功弹窗
      setScene(RESET_SECURITY_SCENES.RESULT_VERIFYING);
      setShowSuccessModal(true);
      if (willLogout && IS_IN_APP) {
        // app 要提前调桥退出登陆态
        // 否则会有需要重复登陆的 bug
        JsBridge.open({
          type: 'func',
          params: { name: 'localLogout' },
        });
      }
    } else if (
      [RESET_SECURITY_RESULT.FAIL, RESET_SECURITY_RESULT.SYSTEM_REJECT].includes(data.status)
    ) {
      // 失败，展示失败信息
      setScene(RESET_SECURITY_SCENES.RESULT_FAILED);
      setFailedReason(data.reason);
    } else {
      // 否则都展示审核中
      setScene(RESET_SECURITY_SCENES.RESULT_VERIFYING);
    }
  };

  const handleRetry = async () => {
    setShowErrorModal(false);
    verifyResRef.current = {};
    if (errorCode === APPLY_RESULT_ERRORS.HAS_PENDING_TICKET) {
      // 有在途工单不给重试，直接展示审核中
      setScene(RESET_SECURITY_SCENES.RESULT_VERIFYING);
    } else {
      // 否则重新选择重置项
      setScene(RESET_SECURITY_SCENES.SELECT_ITEMS);
      onRefreshToken?.();
    }
  };

  /**
   * 组件库 modal 有 bug，不受控
   * 点击 ok 会同时触发 onOk 和 onClose 回调
   * 点击 cancel 会同时触发 onCancel 和 onClose 回调
   * 不传 onClose 又会导致左上角关闭点击无响应
   * 这里用一个 ref 来记录是否已经响应过回调，避免重复响应
   **/
  const callbackResponseRef = useRef(false);

  const handleLogout = () => {
    if (callbackResponseRef.current) {
      return;
    }
    callbackResponseRef.current = true;
    if (IS_IN_APP) {
      // app 通过桥跳 app 登录页
      JsBridge.open({
        type: 'func',
        params: {
          name: 'updateSafeSetting',
          jumpToLogin: true,
        },
      });
    } else {
      // web 直接去登陆页
      window.location.href = addLangToPath('/ucenter/signin');
    }
  };

  const handleConfirm = () => {
    if (callbackResponseRef.current) {
      return;
    }
    callbackResponseRef.current = true;
    if (IS_IN_APP) {
      JsBridge.open({
        type: 'func',
        params: { name: 'jumpToHomePage' },
      });
    } else {
      window.location.href = addLangToPath('/');
    }
  };

  const handlePullOptionalList = async () => {
    try {
      const { data } = await pullSecurityItems({ token });
      const _data = {
        email: data?.EMAIL,
        phone: data?.SMS ? `+${data.SMS}` : '',
        g2fa: data?.GOOGLE2FA,
        tp: data?.WITHDRAW_PASSWORD,
      };
      const res = [];
      SELECT_ITEM_LIST.forEach((id) => {
        const value = _data[id];
        if (value) {
          res.push({ id, address: value || '' });
        }
      });
      setOptionalList(res);
    } catch (error) {
      if (error?.code === '40011') {
        setCaptchaOpen(true);
        return;
      }
      console.error(error);
      toast.error(error?.msg || error?.message);
    }
  };

  useEffect(() => {
    (async () => {
      let data = { status: RESET_SECURITY_RESULT.INIT };
      try {
        const res = await pullResetResult({ token });
        data = res.data || data;
      } catch (error) {
        console.error(error);
      }
      if (data.status === RESET_SECURITY_RESULT.PROCESSING) {
        setScene(RESET_SECURITY_SCENES.RESULT_VERIFYING);
      } else if (
        [RESET_SECURITY_RESULT.FAIL, RESET_SECURITY_RESULT.SYSTEM_REJECT].includes(data.status)
      ) {
        setScene(RESET_SECURITY_SCENES.RESULT_FAILED);
        setFailedReason(data.reason);
      } else {
        setScene(RESET_SECURITY_SCENES.SELECT_ITEMS);
      }
    })();
    /** 只有页面初始化需要查询一次结果，后面不需要 */
  }, []);

  useEffect(() => {
    scene === RESET_SECURITY_SCENES.SELECT_ITEMS && handlePullOptionalList();
  }, [scene]);

  return (
    <main className={styles.layout}>
      {
        IS_IN_APP
          ? (
            // app 一直展示返回按钮
            <div className={styles.backWrapper}>
              <Back onBack={disabledBack ? handleExist : handleBack} showBot />
            </div>
          )
          : !disabledBack
            ? (
              // web 只有非选择页面和审核中页面展示返回按钮
              <div className={styles.backWrapper}>
                <Back onBack={handleBack} showBot />
              </div>
            )
            // 8 px 的占位
            : <div style={{ height: 8, width: '100%' }} />
      }
      {scene === RESET_SECURITY_SCENES.SELECT_ITEMS ? (
        <SelectItems
          token={token}
          list={optionalList}
          loading={loading}
          onNext={handleSelectItems}
        />
      ) : scene === RESET_SECURITY_SCENES.KYC_FACE_VERIFICATION ? (
        <KycFaceVerification
          token={token}
          onNext={(res) => {
            const oldValue = verifyResRef.current;
            verifyResRef.current = merge(oldValue, { data: res });
            if (!isEmpty(res) && !verifyResRef.current.data.isNeedSelfService) {
              // 非空即为活体验证成功，且不需要半自助，开始重置流程
              setScene(
                shouldBindEmail
                  ? RESET_SECURITY_SCENES.BIND_EMAIL
                  : RESET_SECURITY_SCENES.RESET_ITEMS,
              );
            } else {
              // 否则进答题验证
              setScene(RESET_SECURITY_SCENES.QUESTION_VERIFICATION);
            }
          }}
        />
      ) : scene === RESET_SECURITY_SCENES.KYC_CERT_VERIFICATION ? (
        <KycCertVerification
          token={token}
          onNext={(res) => {
            // 证件照成功，进答题验证
            const oldValue = verifyResRef.current;
            verifyResRef.current = merge(oldValue, { data: res });
            setScene(RESET_SECURITY_SCENES.QUESTION_VERIFICATION);
          }}
        />
      ) : scene === RESET_SECURITY_SCENES.QUESTION_VERIFICATION ? (
        <QuestionVerification
          token={token}
          onExist={handleExist}
          onNext={() => {
            // 答题验证成功，进入充值截图验证
            setScene(RESET_SECURITY_SCENES.BILL_VERIFICATION);
          }}
        />
      ) : scene === RESET_SECURITY_SCENES.BILL_VERIFICATION ? (
        <BillVerification
          token={token}
          onNext={(res) => {
            // 充值截图验证成功，开始重置流程
            const oldValue = verifyResRef.current;
            verifyResRef.current = merge(oldValue, { data: res });
            setScene(
              shouldBindEmail
                ? RESET_SECURITY_SCENES.BIND_EMAIL
                : RESET_SECURITY_SCENES.RESET_ITEMS,
            );
          }}
        />
      ) : scene === RESET_SECURITY_SCENES.BIND_EMAIL ? (
        <BindEmail
          token={token}
          onNext={(res) => {
            const oldValue = verifyResRef.current;
            verifyResRef.current = merge(oldValue, { data: res });
            setScene(RESET_SECURITY_SCENES.RESET_ITEMS);
          }}
        />
      ) : scene === RESET_SECURITY_SCENES.RESET_ITEMS ? (
        <ResetItems
          token={token}
          items={resetItems}
          email={email}
          phone={phone}
          onNext={handleSubmit}
        />
      ) : scene === RESET_SECURITY_SCENES.RESULT_VERIFYING ? (
        <ResultVerifying />
      ) : scene === RESET_SECURITY_SCENES.RESULT_FAILED ? (
        <ResultFailed reason={failedReason} onRetry={handleRetry} />
      ) : null}
      <Modal
        isOpen={showSuccessModal}
        title={null}
        okText={willLogout ? _t('15e81c57e6764000a951') : _t('9SkwcefEjEGPA5D1EBPZoY')}
        className={styles.modal}
        onOk={willLogout ? handleLogout : handleConfirm}
        cancelText={willLogout ? _t('9SkwcefEjEGPA5D1EBPZoY') : null}
        onCancel={handleConfirm}
        onClose={handleConfirm}
        footerDirection="vertical"
      >
        <Empty
          name="success"
          size="small"
          title={_t('f3a2580dcee94000a190')}
          description={address ? _t('783403d5328b4800a4a1') : _t('07d7a8ba3c754000aa24')}
        />
      </Modal>
      <Modal
        isOpen={showErrorModal}
        title={null}
        okText={
          ![APPLY_RESULT_ERRORS.HAS_PENDING_TICKET, APPLY_RESULT_ERRORS.LACK_OF_BIND_ITEM].includes(
            errorCode,
          )
            ? _t('retry')
            : _t('i.know')
        }
        className={styles.modal}
        onOk={handleRetry}
        onClose={handleRetry}
      >
        <Empty name="error" size="small" title={errorMsg} />
      </Modal>

      <Captcha
        data-testid="captcha"
        bizType="SECURITY_METHODS_DETAIL"
        onValidateSuccess={() => {
          handlePullOptionalList();
        }}
        open={captchaOpen}
        onClose={() => {
          setCaptchaOpen(false);
        }}
      />
    </main>
  );
}

export default function ResetSecurityWithLayout(props) {
  return (
    <ErrorBoundary scene={SCENE_MAP.resetSecurity.index}>
      <ResetSecurityLayout>
        <AppVersionComparison minAppVersion="4.2.0">
          <ResetSecurity {...props} />
        </AppVersionComparison>
      </ResetSecurityLayout>
    </ErrorBoundary>
  );
};
