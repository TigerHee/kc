/**
 * Owner: vijay.zhou@kupotech.com
 */
import { Button, Form as OriginForm, styled, useSnackbar } from '@kux/mui';
import { useEffect, useState } from 'react';
import plugins from '../plugins';
import { verifyValidationCode } from '../services';
import ErrorDialog from './ErrorDialog';
import CommonModal from './CommonModal';
import useLang from '../hooks/useLang';
import * as sensors from '../utils/sensors';
import FormContext from '../utils/formContext';
import { ERROR_CODE } from '../constants';

const { useForm } = OriginForm;
const FormProvider = FormContext.Provider;

const ExForm = styled(OriginForm)`
  margin-top: 12px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-top: 8px;
  }
  .KuxForm-item + .KuxForm-item {
    margin-top: 28px;
  }
  input[type='number'].security-verify-input {
    appearance: none;
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      display: none;
    }
  }
`;

const ButtonGroup = styled.div`
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TextButton = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  font-weight: 500;
  line-height: 130%;
  text-decoration: underline;
  cursor: pointer;
  margin-top: 24px;
  & + & {
    margin-top: 16px;
  }
`;

const HelpContainer = styled.div`
  padding-bottom: 16px;
`;

/** OTP 验证方式的表单 */
function InnerForm(props) {
  const { _t } = useLang();
  const { message } = useSnackbar();
  const {
    bizType,
    transactionId,
    selectedMethod,
    showSwitch,
    onSwitch,
    onTitleChange,
    onSuccess,
  } = props;
  const [form] = useForm();
  // 表单录入数据
  const [formData, setFormData] = useState({});
  // 记录表单的后端校验结果，用于回显到输入框下面
  const [formError, setFormError] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorCode, setErrorCode] = useState(ERROR_CODE.FORBIDDEN);
  const [errorOpen, setErrorOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const handleSubmit = async () => {
    if (loading) {
      return;
    }
    sensors.submitted({ bizType, transactionId, methods: selectedMethod });
    setLoading(true);
    let formData = null;
    // 提交预处理可能会替换字段名，记录方便后续找回
    const newKey2Field = {};
    try {
      formData = await form.validateFields();
    } catch (err) {
      console.error(err);
    }
    if (formData) {
      try {
        const validations = {};
        Object.keys(formData).forEach((field) => {
          // 提交前预处理
          const { beforeSubmit } = plugins.get(field) ?? {};
          if (beforeSubmit && typeof beforeSubmit === 'function') {
            const [key, value] = beforeSubmit(form);
            validations[key] = value;
            newKey2Field[key] = field; // 记录转换前后字段名的映射
          } else {
            validations[field] = formData[field];
          }
        });
        const res = await verifyValidationCode({ bizType, validations, transactionId });
        if (res.code !== '200') {
          const error = new Error(res.msg);
          error.data = res.data;
          throw error;
        }
        onSuccess(res.data.token);
      } catch (err) {
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
          setErrorCode(ERROR_CODE.MATCHING_TIMEOUT);
          setErrorOpen(true);
        } else {
          message.error(err.msg || err.message);
        }
      }
    }
    setLoading(false);
  };

  const clearError = (field) => {
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
  };

  useEffect(() => {
    onTitleChange(_t('b33911daa6f64000a907'));
  }, []);

  return (
    <FormProvider value={{ form, bizType, transactionId, formData, formError }}>
      <ExForm data-testid="inner-form" form={form} onValuesChange={handleValuesChange}>
        {selectedMethod.map((field) => {
          const { VerifyItem } = plugins.get(field);
          const value = formData[field];
          const handleValueChange = (value) => {
            clearError(field);
            form.setFieldsValue({ [field]: value });
          };
          return (
            <VerifyItem
              key={field}
              bizType={bizType}
              transactionId={transactionId}
              value={value}
              onlyOne={selectedMethod.length === 1}
              onValueChange={handleValueChange}
              onReFocus={clearError}
            />
          );
        })}
        <ButtonGroup>
          <Button onClick={handleSubmit} loading={loading} fullWidth data-testid="submit-button">
            {_t('3b3ebfad1a924000a202')}
          </Button>
          {// 验证方式有配置帮助项才显示帮助按钮
          selectedMethod.some((field) => !!plugins.get(field)?.HelpItem) ? (
            <TextButton
              data-testid="help-button"
              onClick={() => {
                sensors.clickVerifyNotAvailable({ bizType, transactionId });
                setHelpOpen(true);
              }}
            >
              {_t('526a3a5af7454000a431')}
            </TextButton>
          ) : null}
          {// 可选方案大于1个，才显示切换按钮
          showSwitch ? (
            <TextButton data-testid="change-button" onClick={onSwitch}>
              {_t('d10b3b11531e4000ac30')}
            </TextButton>
          ) : null}
        </ButtonGroup>
      </ExForm>
      <ErrorDialog
        open={errorOpen}
        code={errorCode}
        onCancel={() => {
          if (errorCode === ERROR_CODE.MATCHING_TIMEOUT) {
            // 撮合方案超时需要退出，相当于取消验证，token传空
            onSuccess('');
          } else {
            setErrorOpen(false);
          }
        }}
      />
      <CommonModal
        open={helpOpen}
        size="medium"
        title={_t('5c084dbfc2314000a2b8')}
        onCancel={() => setHelpOpen(false)}
      >
        <HelpContainer>
          {selectedMethod.map((field) => {
            const { HelpItem } = plugins.get(field) ?? {};

            if (!HelpItem) {
              return null;
            }

            return (
              <HelpItem
                key={field}
                bizType={bizType}
                transactionId={transactionId}
                onlyOne={selectedMethod.length === 1}
              />
            );
          })}
        </HelpContainer>
      </CommonModal>
    </FormProvider>
  );
}

export default InnerForm;
