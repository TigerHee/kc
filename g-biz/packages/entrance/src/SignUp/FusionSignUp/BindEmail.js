import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme, Form, styled } from '@kux/mui';
import { useWatch } from '@kux/mui/node/Form';
import { kcsensorsManualTrack } from '@utils/sensors';
import map from 'lodash/map';
import { removeSpaceSE, checkAccountType } from '../../common/tools';
import { getEmailSuffixes } from '../../Login/service';
import { useToast, useLang, useTrackingConfigDataOfInviter } from '../../hookTool';
import { Back } from '../../components/Back';
import { NAMESPACE } from '../constants';

import { ExtendForm, Tips, AccountInput, FormItemBox, Title, BindEmailButton } from './styled';

const { useForm, FormItem } = Form;

const DropdownMenu = styled.ul`
  position: absolute;
  top: 56px;
  margin: 0 0 0;
  padding: 0;
  width: 100%;
  max-height: 336px;
  overflow-y: auto;
  background: ${(props) => props.theme.colors.overlay};
  border: 1px solid ${(props) => props.theme.colors.cover4};
  box-shadow: 0 4px 40px 0 rgba(0, 0, 0, 0.06);
  border-radius: 8px;
`;

const DropdownMenuItem = styled.li`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 56px;
  padding: 0 16px;
  font-weight: 400;
  font-size: 16px;
  line-height: 26px;
  list-style: none;
  color: ${(props) => props.theme.colors.text40};
  cursor: pointer;
  word-wrap: break-word;
  direction: ltr;
  [dir='rtl'] & {
    justify-content: flex-end;
  }
  &:hover {
    background-color: ${(props) => props.theme.colors.cover2};
  }
`;

const SuffixText = styled.span`
  direction: ltr;
  color: ${(props) => props.theme.colors.text};
`;

const BindEmial = (props) => {
  const { onFinish, recallType = null, fromDrawer, initValues, onAccountInput, onBack } = props;

  const [form] = useForm();
  const accountValue = useWatch('account', form);
  const { validateFields, setFields } = form;
  const [emailSuffixes, setEmailSuffixes] = useState([]);
  const [inputIsFocus, setInputIsFocus] = useState(false);
  const { t } = useLang();
  const dispatch = useDispatch();
  const toast = useToast();
  const theme = useTheme();
  const [disabled, setDisabled] = useState(true);
  const { isCount, preRegisterData } = useSelector((state) => state[NAMESPACE]);
  const isCaptchaOpen = useSelector((state) => state[NAMESPACE].isCaptchaOpen);
  const sendVerifyCodeLoading = useSelector(
    (s) => s.loading.effects[`${NAMESPACE}/sendVerifyCode`],
  );

  const handleValidate = (value, callback) => {
    if (typeof value === 'string' && value.trim() === '') {
      callback(new Error(t('form.required')));
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

  const handleInputChange = (e) => {
    validateFnRef.current(e.target.value, () => {});
  };

  const rules = useMemo(
    () => [
      {
        validator: (rule, value, callback) => {
          validateFnRef.current(value, callback);
        },
      },
    ],
    [],
  );

  // 发送邮箱验证码
  const handleSendEmailCode = async (params) => {
    const { email } = params || {};
    kcsensorsManualTrack({ spm: ['emailSendCode', '1'], data: trackingConfigData }, 'page_click');
    await dispatch({
      type: `${NAMESPACE}/sendEmailVerifyCode`,
      payload: { toast, email: removeSpaceSE(email), validationBiz: 'REGISTER_EMAIL' },
    });
    // 注册召回接口调用
    if (recallType !== null) {
      await dispatch({
        type: `${NAMESPACE}/postEmailRecall`,
        payload: {
          language: navigator.language,
          type: recallType,
          email: removeSpaceSE(email),
        },
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
      await dispatch({
        type: `${NAMESPACE}/update`,
        payload: { preRegisterData: _preRegisterData, registerType: 'email' },
      });
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
    return emailSuffixes.filter((item) => item.startsWith(_suffix) && item !== _suffix);
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
    (async () => {
      const { data } = await getEmailSuffixes();
      setEmailSuffixes(data || []);
    })();
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
      <Title theme={theme} fromDrawer={fromDrawer}>
        {t('1cf576fa3a4f4000af21')}
      </Title>
      <Tips>{t('804968ae27104000a308')}</Tips>
      <ExtendForm size="large" form={form}>
        <FormItemBox>
          <FormItem
            name="account"
            label={t('5e072c122d574000a8ba')}
            rules={rules}
            validateTrigger={['onBlur', 'onSubmit']}
            help=""
            initialValue={initValues}
          >
            <AccountInput
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
            />
          </FormItem>
          {matchedSuffixes?.length && inputIsFocus ? (
            <DropdownMenu theme={theme}>
              {map(matchedSuffixes, (item) => (
                <DropdownMenuItem
                  style={{ direction: 'ltr' }}
                  key={item}
                  theme={theme}
                  onMouseDown={() =>
                    form.setFieldsValue({
                      account: `${accountValue.slice(0, accountValue?.indexOf?.('@'))}@${item}`,
                    })
                  }
                >
                  {`${accountValue.slice(0, accountValue?.indexOf?.('@'))}@`}
                  <SuffixText theme={theme}>{item}</SuffixText>
                </DropdownMenuItem>
              ))}
            </DropdownMenu>
          ) : null}
        </FormItemBox>
        <BindEmailButton
          fullWidth
          size="large"
          loading={!!sendVerifyCodeLoading || isCaptchaOpen}
          disabled={!!sendVerifyCodeLoading || isCaptchaOpen || disabled}
          onClick={handleSubmit}
          data-inspector="bind_email_btn"
        >
          {t('vHBPtPwoVzxY4ZqfjDhAaR')}
        </BindEmailButton>
      </ExtendForm>
    </>
  );
};

export default BindEmial;
