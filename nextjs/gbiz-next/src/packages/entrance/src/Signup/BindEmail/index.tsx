/**
 * Owner: sean.shi@kupotech.com
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Form, Input, Button } from '@kux/mui';
import { kcsensorsManualTrack } from 'tools/sensors';
import map from 'lodash/map';
import clsx from 'clsx';
import { removeSpaceSE, checkAccountType } from '../../common/tools';
import { getMailSuffixesUsingGet } from '../../api/market-operation';
import { useToast, useLang, useTrackingConfigDataOfInviter } from '../../hookTool';
import { Back } from '../../components/Back';
import { useSignupStore } from '../model';
import styles from './index.module.scss';

const { useForm, FormItem } = Form;

interface BindEmailProps {
  onFinish?: () => void;
  recallType?: string | null;
  fromDrawer?: boolean;
  initValues?: string;
  onAccountInput?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBack?: () => void;
}

const BindEmail: React.FC<BindEmailProps> = (props) => {
  const { onFinish, recallType = null, fromDrawer, initValues, onAccountInput, onBack } = props;

  const [form] = useForm();
  const accountValue = Form.useWatch('account', form);
  const { validateFields, setFields } = form;
  const [inputIsFocus, setInputIsFocus] = useState(false);
  const { t } = useLang();
  const toast = useToast();
  const [disabled, setDisabled] = useState(true);
  
  // 使用 Zustand store
  const emailSuffixes = useSignupStore(state => state.emailSuffixes);
  const isCount = useSignupStore(state => state.isCount);
  const preRegisterData = useSignupStore(state => state.preRegisterData);
  const isCaptchaOpen = useSignupStore(state => state.isCaptchaOpen);
  const loading = useSignupStore(state => state.loading);
  const sendEmailVerifyCode = useSignupStore(state => state.sendEmailVerifyCode);
  const postEmailRecall = useSignupStore(state => state.postEmailRecall);
  const updateStore = useSignupStore(state => state.update);
  const getEmailSuffixes = useSignupStore(state => state.getEmailSuffixes);

  const handleValidate = (value: string, callback: (error?: Error) => void) => {
    if (typeof value === 'string' && value.trim() === '') {
      callback(new Error(t('form_required')));
      setDisabled(true);
    } else if (!checkAccountType(value, 'email') && /@/.test(value)) {
      // 带@符号但不满足邮箱正则
      callback(new Error(t('fsCtaeGdJidTiUDSdysTGN')));
      setDisabled(true);
    } else if (!checkAccountType(value, 'email')) {
      // 不满足任何邮箱表达式
      callback(new Error(t('form_email_error')));
      setDisabled(true);
    } else {
      callback();
      setDisabled(false);
    }
  };

  const validateFnRef = useRef(handleValidate);
  validateFnRef.current = handleValidate;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    validateFnRef.current(e.target.value, () => {});
  };

  const rules = useMemo(
    () => [
      {
        validator: (rule: any, value: string, callback: (error?: Error) => void) => {
          validateFnRef.current(value, callback);
        },
      },
    ],
    [],
  );

  // 发送邮箱验证码
  const handleSendEmailCode = async (params: { email?: string }) => {
    const { email } = params || {};
    kcsensorsManualTrack({ spm: ['emailSendCode', '1'], data: trackingConfigData }, 'page_click');
    await sendEmailVerifyCode?.({ 
      toast, 
      t,
      email: removeSpaceSE(email || ''), 
      validationBiz: 'REGISTER_EMAIL' 
    });
    // 注册召回接口调用
    if (recallType !== null && recallType !== undefined) {
      await postEmailRecall?.({
        language: navigator.language,
        type: parseInt(recallType, 10),
        email: removeSpaceSE(email || ''),
      });
    }
  };

  // 提交注册
  const handleSubmit = async () => {
    try {
      const { account, ...values } = await validateFields();
      const _preRegisterData = {
        ...preRegisterData,
        ...values,
        email: account,
      };
      kcsensorsManualTrack({ spm: ['emailConfirm', '1'], data: trackingConfigData }, 'page_click');
      kcsensorsManualTrack(
        {
          spm: ['signupBindEmail', 'confirm'],
          data: {
            before_click_element_value: '',
            after_click_element_value: 'confirm',
          },
        },
        'page_click',
      );
      updateStore?.({ preRegisterData: _preRegisterData, registerType: 'email' });
      await handleSendEmailCode(_preRegisterData);
    } catch (e) {
      kcsensorsManualTrack({ spm: ['accountConfirmError', '1'] });
    }
  };

  // focus账号输入框
  const handleAccountFocus = () => {
    setInputIsFocus(true);
    setFields([{ name: 'account', errors: [] }]);
  };

  const handleAccountBlur = () => {
    setInputIsFocus(false);
    kcsensorsManualTrack({ spm: ['newEmailInsert', '1'] }, 'page_click');
    kcsensorsManualTrack(
      {
        spm: ['signupBindEmail', 'emailInput'],
        data: {
          before_click_element_value: '',
          after_click_element_value: 'notEmpty',
        },
      },
      'page_click',
    );
  };

  // 针对当前输入匹配后缀
  const matchedSuffixes = useMemo(() => {
    if (!accountValue) return [];
    // 获取分隔符索引
    const index = accountValue.indexOf('@');
    // 无@分隔符则不推荐
    if (index === -1) return [];
    const _suffix = accountValue.slice(index + 1);
    return emailSuffixes?.filter((item) => item.startsWith(_suffix) && item !== _suffix);
  }, [accountValue, emailSuffixes]);

  const trackingConfigData = useTrackingConfigDataOfInviter();

  // 绑定邮箱组件曝光事件
  useEffect(() => {
    kcsensorsManualTrack({
      spm: ['signupBindEmail', '1'],
      data: {
        is_login: false,
        pre_spm_id: 'kcWeb.B1register.SMSSecurityVerify.submit',
      },
    });
  }, []);

  // 获取邮箱后缀
  useEffect(() => {
    getEmailSuffixes?.();
  }, []);

  useEffect(() => {
    // 验证码是否发送成功状态
    if (isCount) {
      typeof onFinish === 'function' && onFinish();
    }
  }, [isCount, onFinish]);

  return (
    <>
      <Back onBack={onBack} />
      <h2 className={clsx(styles.title, fromDrawer && styles.fromDrawer)}>
        {t('1cf576fa3a4f4000af21')}
      </h2>
      <p className={styles.tips}>{t('804968ae27104000a308')}</p>
      <Form size="large" form={form} className={styles.extendForm}>
        <div className={styles.formItemBox}>
          <FormItem
            name="account"
            label={t('5e072c122d574000a8ba')}
            rules={rules}
            validateTrigger={['onBlur', 'onSubmit']}
            help=""
            initialValue={initValues}
          >
            <Input
              size="xlarge"
              placeholder={t('5e072c122d574000a8ba')}
              onFocus={handleAccountFocus}
              onBlur={handleAccountBlur}
              onInput={onAccountInput}
              onChange={handleInputChange}
              autoComplete="off"
              data-inspector="bind_email_input"
              inputProps={{ autoFocus: true, autocomplete: 'off' }}
              allowClear
              autoFocus
              className={styles.accountInput}
            />
          </FormItem>
          {matchedSuffixes?.length && inputIsFocus ? (
            <ul className={styles.dropdownMenu}>
              {map(matchedSuffixes, (item) => (
                <li
                  style={{ direction: 'ltr' }}
                  key={item}
                  className={styles.dropdownMenuItem}
                  onMouseDown={() =>
                    form.setFieldsValue({
                      account: `${accountValue.slice(0, accountValue?.indexOf?.('@'))}@${item}`,
                    })
                  }
                >
                  {`${accountValue.slice(0, accountValue?.indexOf?.('@'))}@`}
                  <span className={styles.suffixText}>{item}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <Button
          fullWidth
          size="large"
          loading={!!loading || isCaptchaOpen}
          disabled={!!loading || isCaptchaOpen || disabled}
          onClick={handleSubmit}
          data-inspector="bind_email_btn"
          className={styles.bindEmailButton}
        >
          {t('vHBPtPwoVzxY4ZqfjDhAaR')}
        </Button>
      </Form>
    </>
  );
};

export default BindEmail;
