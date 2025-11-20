import { useEffect, useMemo } from "react";
import useLang from "../../../../hooks/useLang";
import { Button, Form } from "@kux/design";
import plugins from "../../../../plugins";
import styles from "./styles.module.scss";
import { useVerification } from "../../model";
import { clickVerifyNotAvailable } from "packages/verification/src/utils/sensors";

export default function OTP({
  form,
  bizType,
  transactionId,
  selectedMethod,
  canSwitch,
  loading,
  onSuccess,
  onSwitch,
  onUnavailable
}) {
  const { t } = useLang();
  const { openResetSecurityPage } = useVerification();
  const { formData, setFormData, formError, setFormError } = useVerification();
  const validMethods = useMemo(() => selectedMethod.filter((field: string) => {
    const { isOTP = () => false } = plugins.get(field);
    return isOTP();
  }), [selectedMethod]);

  const clearError = (field: string) => {
    if (form.getFieldError(field)?.length > 0) {
      const placeHolder = '******'; // 合法校验占位符
      const formValue = form.getFieldValue(field);
      form.setFieldsValue({ [field]: placeHolder });
      setFormError({ ...formError, [field]: undefined }); // 清除异常信息
      form.validateFields([field]); // 去除错误提示
      form.setFieldsValue({ [field]: formValue });
    }
  };

  const handleValuesChange = async () => {
    // form 的 onValuesChange 触发时机早于子组件 Input 的 onChange
    // 由于验证码需要对输入做格式化，此时获取的 data 是未格式化的数据
    // 因此异步处理
    await Promise.resolve();
    const data = form.getFieldsValue();
    setFormData(data);
    
    const fields = Object.keys(data);
    // 检查是否自动提交
    const shouldAutoSubmit =
      fields.length &&
      fields.every((field) => {
        // 检查字段是否支持自动提交，默认不支持
        const { autoSubmit } = plugins.get(field) ?? {};
        if (autoSubmit && typeof autoSubmit === 'function') {
          return autoSubmit(form);
        }
        return false;
      });
    if (shouldAutoSubmit) {
      handleSubmit();
    }
  }

  const handleSubmit = async () => {
    const data = await form.validateFields();
    onSuccess(data);
  }

  useEffect(() => {
    // 切换方案时，重置表单数据
    form.setFieldsValue(formData);
  }, [selectedMethod]);
  
  return <>
    <Form
      className={styles.exForm}
      autoComplete="off"
      data-testid="inner-form"
      form={form}
    >
      {validMethods.map((field: string) => {
        const { VerifyItem } = plugins.get(field);
        const value = formData[field];
        const handleValueChange = (value: string) => {
          clearError(field);
          form.setFieldsValue({ [field]: value });
          handleValuesChange();
        };
        return (
          <VerifyItem
            key={field}
            bizType={bizType}
            transactionId={transactionId}
            value={value}
            formError={formError}
            onlyOne={validMethods.length === 1}
            onValueChange={handleValueChange}
            onReFocus={clearError}
          />
        );
      })}
      <div className={styles.buttonGroup}>
        <Button onClick={handleSubmit} type="primary" loading={loading} fullWidth data-testid="submit-button">
          {t('3b3ebfad1a924000a202')}
        </Button>
        <span className={styles.textButton} data-testid="help-button" onClick={() => {
          clickVerifyNotAvailable({ bizType, transactionId });
          if (typeof onUnavailable === 'function') {
            onUnavailable();
          } else {
            openResetSecurityPage();
          }
        }}>
          {t('526a3a5af7454000a431')}
        </span>
        {// 可选方案大于1个，才显示切换按钮
        canSwitch ? (
          <span className={styles.textButton} data-testid="change-button" onClick={onSwitch}>
            {t('d10b3b11531e4000ac30')}
          </span>
        ) : null}
      </div>
    </Form>
  </>;
};