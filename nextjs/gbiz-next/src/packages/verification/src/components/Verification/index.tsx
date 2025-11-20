import { useState } from "react";
import { useVerification } from "./model";
import { clickChangeMethod } from '../../utils/sensors';
import { ERROR_CODE, METHODS, SecVerifyResponse } from "../../enums";
import { Form, Modal, toast } from "@kux/design";
import useLang from '../../hooks/useLang';
import MethodSelector from "./components/MethodSelector";
import styles from "./styles.module.scss";
import Passkey from "./components/Passkey";
import OTP from "./components/OTP";
import ErrorInfo from "./components/ErrorInfo";
import { submitted } from '../../utils/sensors';
import plugins from "../../plugins";
import { riskValidationVerifyUsingPost } from "../../api/risk-validation-center";
import { SCENE } from "../../enums";
import classNames from "classnames";
export interface VerificationProps {
  bizType: string;
  errorRender?: (errorCode: string, { onCancel }: { onCancel: () => void }) => React.ReactNode;
  onSuccess: (params: SecVerifyResponse) => void;
  onCancel: () => void;
  onUnavailable?: () => void;
}

export default function Verification({
  bizType,
  errorRender,
  onSuccess,
  onCancel,
  onUnavailable
}: VerificationProps) {
  const { combineResult, scene, selectedMethod, getFormData, setFormError, setScene, setSelectedMethod } = useVerification();
  const [form] = Form.useForm();
  const [switchOpen, setSwitchOpen] = useState(false);
  const { t } = useLang();
  const [loading, setLoading] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);

  const { transactionId, methods, supplement, errorCode, isNeedLiveVerify, isNeedSelfService } = combineResult!;

  const handleSwitch = () => {
    clickChangeMethod({ bizType, transactionId });
    if (methods.length === 2) {
      // 仅有2个方案或不需要选择时，点击切换直接，不需要弹窗选择
      const index = methods.findIndex((method) => method !== selectedMethod);
      setSelectedMethod(methods[index]);
    } else {
      setSwitchOpen(true);
    }
  };

  const handleSubmit = async () => {
    if (loading) {
      return;
    }
    submitted({ bizType, transactionId, methods: selectedMethod });
    setLoading(true);
    // 提交预处理可能会替换字段名，记录方便后续找回
    const newKey2Field = {};

    try {
      const validations = {};
      const _formData = getFormData();
      Object.keys(_formData).forEach((field) => {
        // 提交前预处理
        const { beforeSubmit } = plugins.get(field) ?? {};
        if (beforeSubmit && typeof beforeSubmit === 'function') {
          const [key, value] = beforeSubmit(form);
          validations[key] = value;
          newKey2Field[key] = field; // 记录转换前后字段名的映射
        } else {
          validations[field] = _formData[field];
        }
      });
      const { data } = await riskValidationVerifyUsingPost({
        bizType: bizType as any,
        validations,
        transactionId
      });
      onSuccess({
        headers: { 'X-VALIDATION-TOKEN': (data as any)?.token },
        data: { isNeedLiveVerify, isNeedSelfService }
      });
    } catch (err: any) {
      if (err.data?.failedValidations?.length) {
        const errorInfos = {};
        err.data.failedValidations.forEach(({ validationType, checkResult, checkResultMsg }) => {
          // 找回源字段名，记录后端校验的错误信息
          const originField = newKey2Field[validationType] ?? validationType;
          errorInfos[originField] = checkResultMsg ?? checkResult;
        });
        setFormError(errorInfos);
        // 触发重新校验，使错误信息回显
        // 相应 rule 看 InnerFormItem 里的 commonRules
        form.validateFields();
      }
      if (err.code === ERROR_CODE.MATCHING_TIMEOUT) {
        // 撮合方案超时不用toast，而是弹窗提示，点确认退出页面
        setErrorOpen(true);
      } else {
        toast.error(err.msg || err.message);
      }
    }
    setLoading(false);
  }

  if (errorCode) {
    return errorRender?.(errorCode, { onCancel }) || <ErrorInfo
      bizType={bizType}
      code={errorCode}
      supplement={supplement}
      onCancel={onCancel}
    />
  }

  return <>
    {
      [SCENE.PASSKEY, SCENE.PASSKEY_SUPPLEMENT].includes(scene)
        ? <Passkey
          selectedMethod={selectedMethod}
          otherMethods={methods.filter((method) => method !== selectedMethod)}
          supplement={supplement}
          onSuccess={() => {
            if (selectedMethod.filter((method) => method !== METHODS.PASSKEY).length > 0) {
              setScene(SCENE.OTP);
            } else {
              handleSubmit();
            }
          }}
          canSwitch={methods.length > 1}
          onSwitch={handleSwitch}
          onCancel={onCancel}
        />
        : scene === SCENE.OTP ? <OTP
          form={form}
          bizType={bizType}
          transactionId={transactionId}
          selectedMethod={selectedMethod}
          canSwitch={methods.length > 1}
          onSwitch={handleSwitch}
          loading={loading}
          onSuccess={() => {
            handleSubmit();
          }}
          onUnavailable={onUnavailable}
        />
        : null
    }
    <Modal
      isOpen={switchOpen}
      onClose={() => setSwitchOpen(false)}
      title={t('95018f7c441f4000a3f2')}
      size="medium"
      className={styles.commonModal}
      footer={null}
      mobileTransform
    >
      <MethodSelector
        methods={methods.filter((method) => method !== selectedMethod)}
        onChange={(method) => {
          setSelectedMethod(method);
          setSwitchOpen(false);
        }}
      />
    </Modal>
    <Modal
      isOpen={errorOpen}
      title={null}
      footer={null}
      className={classNames(styles.commonModal, styles.errorDialog)}
      onClose={() => {
        setErrorOpen(false);
        onCancel();
      }}
    >
      <ErrorInfo
        bizType={bizType}
        code={ERROR_CODE.MATCHING_TIMEOUT}
        supplement={[]}
        onCancel={() => {
          setErrorOpen(false);
          onCancel();
        }}
      />
    </Modal>
  </>
};