/**
 * Owner: willen@kupotech.com
 */

// 融合输入框，根据输入的内容识别是邮箱、手机号，同时支持子账号登录，需配合Form使用

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Input, styled, Form, useTheme } from '@kux/mui';
import { map } from 'lodash';
import { tenantConfig } from '@packages/entrance/src/config/tenant';
import PhoneAreaSelector from '../PhoneAreaSelector';
import { useLang } from '../../hookTool';
import { getEmailSuffixes } from '../../Login/service';
import { checkAccountType, kcsensorsManualTrack } from '../../common/tools';

const { FormItem, useWatch } = Form;

export const AccountInput = styled(Input)`
  .KuxInput-prefix {
    display: ${({ showPrefix }) => (showPrefix ? 'inline-flex' : 'none')};
  }
`;

export const PhoneAreaSelectorWrapper = styled.div`
  display: flex;
  .customDropdown {
    transform: translate(0px, 38px) !important;
  }
`;

const FormItemBox = styled.div`
  position: relative;
  z-index: 1;
`;

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

const isInputPhoneNumber = (accountValue) => /^\d{3,}$/.test(accountValue);

const FusionInputFormItem = ({
  form,
  fromDrawer,
  scene, // 使用场景，主要为值为login或forgetPwd时，国家区号有一些特殊逻辑
  countryCodes,
  onInputFocus,
  onInputBlur,
  errorTips,
  initValues,
  disabled,
  isSubAccount, // 是否是子账号
  onAccountInput,
  multiSiteConfig,
  // 失焦是否会校验
  shouldBlurValidate = true,
}) => {
  const {
    t,
    i18n: { language },
  } = useLang();
  const formRef = useRef(form);
  formRef.current = form;
  const theme = useTheme();
  const accountValue = useWatch('account', form);
  const countryCodeValue = useWatch('countryCode', form);
  const [emailSuffixes, setEmailSuffixes] = useState([]);
  const [inputIsFocus, setInputIsFocus] = useState(false);
  const [showHelpText, setShowHelpText] = useState(false);

  const supportEmailAccount = multiSiteConfig?.accountConfig?.accountTypes?.includes('email');
  const supportPhoneAccount = multiSiteConfig?.accountConfig?.accountTypes?.includes('phone');
  const supportBoth = supportEmailAccount && supportPhoneAccount;

  const validateTrigger = shouldBlurValidate ? ['onBlur', 'onSubmit'] : ['onSubmit'];

  const getAccountLabel = () => {
    if (supportBoth) return t('dy9jB3DZ7dQkbTXPLbgBNt');
    if (supportEmailAccount) return t('5e072c122d574000a8ba');
    if (supportPhoneAccount) return t('2fc5c2928fd74000a09f');
    return t('dy9jB3DZ7dQkbTXPLbgBNt');
  };

  // focus账号输入框
  const handleAccountFocus = () => {
    setInputIsFocus(true);
    form.setFields([{ name: 'account', errors: [] }]);
    onInputFocus?.();
  };

  const handleAccountBlur = () => {
    kcsensorsManualTrack(
      {
        spm: ['createAccount', 'signupAccountInput'],
        data: {
          before_click_element_value: '',
          after_click_element_value: 'notEmpty',
          is_login: false,
        },
      },
      'page_click',
    );
    setInputIsFocus(false);
    onInputBlur?.();
  };

  // 外部传入错误提示，调用一下validateFields让其展示出来
  useEffect(() => {
    if (errorTips) {
      formRef.current.validateFields(['account']);
    }
  }, [errorTips]);

  // 获取邮箱后缀
  useEffect(() => {
    (async () => {
      // 子账号不推荐邮箱后缀
      if (!isSubAccount) {
        const { data } = await getEmailSuffixes();
        setEmailSuffixes(data || []);
      }
    })();
  }, [isSubAccount]);

  useEffect(() => {
    // 子账号不展示 help
    if (isSubAccount) {
      setShowHelpText(false);
    } else {
      setShowHelpText(isInputPhoneNumber(accountValue));
    }
  }, [accountValue, isSubAccount]);

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

  const rules = [
    {
      validator: () => {
        if (errorTips) return Promise.reject(errorTips);
        return Promise.resolve();
      },
      message: errorTips,
    },
    {
      validator: (rule, value) => {
        if (typeof value === 'string' && value.trim() === '') {
          return Promise.reject(t('form.required'));
        }
        return Promise.resolve();
      },
      message: t('form.required'),
    },
  ];

  if (isSubAccount) {
    // 子账号规则
    rules.push({
      validator: (rule, value) => {
        // 子账号长度限制
        if (value?.trim?.()?.length > 24) {
          return Promise.reject(t('6f8743d779524000a276'));
        }
        return Promise.resolve();
      },
      message: t('6f8743d779524000a276'),
    });
  } else {
    // 非子账号的规则
    if (supportBoth) {
      rules.push(
        ...[
          {
            validator: (rule, value) => {
              // 带@符号但不满足邮箱正则
              if (!checkAccountType(value) && /@/.test(value)) {
                return Promise.reject(t('fsCtaeGdJidTiUDSdysTGN'));
              }
              return Promise.resolve();
            },
            message: t('fsCtaeGdJidTiUDSdysTGN'),
          },
          {
            validator: (rule, value) => {
              if (!checkAccountType(value)) {
                // 不满足任何正则表达
                return Promise.reject(t('gB9puTeE34X2uccUWoTnjj'));
              }
              return Promise.resolve();
            },
            message: t('gB9puTeE34X2uccUWoTnjj'),
          },
          {
            validator: (rule, value) => {
              // 登录和忘记密码场景可以不选国家区号
              if (['forgetPwd', 'login'].some((i) => i === scene)) return Promise.resolve();
              if (checkAccountType(value) === 'phone' && !countryCodeValue) {
                return Promise.reject(t('tFfRcu2BufuXheRP4fbUTe'));
              }
              return Promise.resolve();
            },
            message: t('tFfRcu2BufuXheRP4fbUTe'),
          },
        ],
      );
    }
    if (supportEmailAccount && !supportBoth) {
      rules.push(
        ...[
          {
            validator: (rule, value) => {
              // 带@符号但不满足邮箱正则
              if (!checkAccountType(value, 'email') && /@/.test(value)) {
                return Promise.reject(t('fsCtaeGdJidTiUDSdysTGN'));
              }
              return Promise.resolve();
            },
            message: t('fsCtaeGdJidTiUDSdysTGN'),
          },
          {
            validator: (rule, value) => {
              if (!checkAccountType(value, 'email')) {
                // 不满足任何邮箱表达式
                return Promise.reject(t('form_email_error'));
              }
              return Promise.resolve();
            },
            message: t('form_email_error'),
          },
        ],
      );
    }
    if (supportPhoneAccount && !supportBoth) {
      rules.push(
        ...[
          {
            validator: (rule, value) => {
              if (!checkAccountType(value, 'phone')) {
                // 不满足任何正则表达
                return Promise.reject(t('form_phone_error'));
              }
              return Promise.resolve();
            },
            message: t('form_phone_error'),
          },
          {
            validator: (rule, value) => {
              // 登录和忘记密码场景可以不选国家区号
              if (['forgetPwd', 'login'].some((i) => i === scene)) return Promise.resolve();
              if (checkAccountType(value, 'phone') === 'phone' && !countryCodeValue) {
                return Promise.reject(t('tFfRcu2BufuXheRP4fbUTe'));
              }
              return Promise.resolve();
            },
            message: t('tFfRcu2BufuXheRP4fbUTe'),
          },
        ],
      );
    }
  }

  return (
    <FormItemBox>
      <FormItem
        name="account"
        label={isSubAccount ? t('5de5eaee1ccf4000a8f1') : getAccountLabel()}
        rules={rules}
        validateTrigger={validateTrigger}
        help={
          // 输入了区号，只要不是输入状态 就不再展示提示文案
          showHelpText && supportPhoneAccount && (!countryCodeValue || inputIsFocus)
            ? t('40d69ded64584000ae66')
            : ''
        }
        initialValue={initValues?.account}
      >
        <AccountInput
          id="login_account_input"
          disabled={disabled}
          size="xlarge"
          placeholder={isSubAccount ? t('5de5eaee1ccf4000a8f1') : getAccountLabel()}
          onFocus={handleAccountFocus}
          onBlur={handleAccountBlur}
          onInput={onAccountInput}
          autoComplete="off"
          showPrefix={isInputPhoneNumber(accountValue) && !isSubAccount} // 通过css控制显隐，避免dom重复加载
          data-inspector={`signin_${isSubAccount ? 'sub' : 'account'}_input`}
          prefix={
            supportPhoneAccount ? (
              <PhoneAreaSelectorWrapper>
                <FormItem
                  name="countryCode"
                  fullWidth={false}
                  noStyle
                  initialValue={tenantConfig.common.initCountryCode || initValues?.countryCode} // 土耳其站只展示土耳其区号
                >
                  <PhoneAreaSelector
                    logo
                    countries={countryCodes}
                    language={language}
                    forbiddenCountry
                    fromDrawer={fromDrawer}
                    scene={scene}
                    disabled={tenantConfig.common.isCountryCodeDisabled ? true : disabled}
                    defaultValue={initValues?.countryCode}
                    useInit={
                      tenantConfig.common.isCountryCodeUseInit ? true : !!initValues?.countryCode
                    }
                  />
                </FormItem>
              </PhoneAreaSelectorWrapper>
            ) : null
          }
          inputProps={{ autoFocus: true, autocomplete: 'off' }}
          allowClear
        />
      </FormItem>
      {matchedSuffixes?.length && inputIsFocus && supportEmailAccount ? (
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
  );
};

export default FusionInputFormItem;
