import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Input, Form } from '@kux/mui';
import { map } from 'lodash-es';
import { getTenantConfig } from '../../config/tenant';
import { kcsensorsManualTrack } from 'tools/sensors';
import { useLang } from '../../hookTool';
import { getMailSuffixesUsingGet } from '../../api/market-operation';
import { checkAccountType } from '../../common/tools';
import PhoneAreaSelector, { IPhoneAreaSelectorProps } from '../PhoneAreaSelector';
import styles from './index.module.scss';

const { FormItem, useWatch } = Form;

export type FusionInputFormItemProps = {
  form: any;
  fromDrawer?: boolean;
  scene?: string;
  countryCodes?: IPhoneAreaSelectorProps['countries'];
  onInputFocus?: () => void;
  onInputBlur?: () => void;
  errorTips?: string;
  initValues?: { account?: string; countryCode?: string };
  disabled?: boolean;
  isSubAccount?: boolean;
  onAccountInput?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  multiSiteConfig?: any;
  shouldBlurValidate?: boolean;
} & Pick<IPhoneAreaSelectorProps, 'language' | 'scene'>;

const isInputPhoneNumber = (accountValue: string) => /^\d{3,}$/.test(accountValue);

const FusionInputFormItem: React.FC<FusionInputFormItemProps> = ({
  form,
  fromDrawer,
  scene,
  countryCodes,
  onInputFocus,
  onInputBlur,
  errorTips,
  initValues,
  disabled,
  isSubAccount,
  onAccountInput,
  multiSiteConfig,
  shouldBlurValidate = true,
}) => {
  const {
    t,
    i18n: { language },
  } = useLang();
  const tenantConfig = getTenantConfig();
  const formRef = useRef(form);
  formRef.current = form;
  const firstValidateRef = useRef(true);
  const accountValue = useWatch('account', form);
  const countryCodeValue = useWatch('countryCode', form);
  const [emailSuffixes, setEmailSuffixes] = useState<string[]>([]);
  const [inputIsFocus, setInputIsFocus] = useState(false);
  const [showHelpText, setShowHelpText] = useState(false);

  const supportEmailAccount = multiSiteConfig?.accountConfig?.accountTypes?.includes('email');
  const supportPhoneAccount = multiSiteConfig?.accountConfig?.accountTypes?.includes('phone');
  const supportBoth = supportEmailAccount && supportPhoneAccount;

  const validateTrigger = shouldBlurValidate ? ['onBlur', 'onSubmit'] : ['onSubmit'];

  const getAccountLabel = (isPlaceholder: boolean = false) => {
    // 不是 placehoder 并且 聚焦或者输入框有内容，则不展示“不带区号”文案
    const showWithoutCode = !isPlaceholder && (inputIsFocus || accountValue);
    if (supportBoth) return showWithoutCode ? t('cb5ea76093d54000a7f3') : t('4RuBrJWdcNn6DnHEjVzhsS');
    if (supportEmailAccount) return t('5e072c122d574000a8ba');
    if (supportPhoneAccount) return t('2fc5c2928fd74000a09f');
    return showWithoutCode ? t('cb5ea76093d54000a7f3') : t('4RuBrJWdcNn6DnHEjVzhsS');
  };

  const handleAccountFocus = () => {
    firstValidateRef.current = false;
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
      'page_click'
    );
    setInputIsFocus(false);
    onInputBlur?.();
  };

  useEffect(() => {
    if (errorTips) {
      formRef.current.validateFields(['account']);
    }
  }, [errorTips]);

  // 区号变化的时候，重新校验一下表单
  useEffect(() => {
    if (form.getFieldError('account')?.length > 0) {
      formRef.current.validateFields(['account']);
    }
  }, [countryCodeValue]);

  useEffect(() => {
    (async () => {
      if (!isSubAccount) {
        const { data } = await getMailSuffixesUsingGet();
        setEmailSuffixes(data || []);
      }
    })();
  }, [isSubAccount]);

  useEffect(() => {
    if (isSubAccount) {
      setShowHelpText(false);
    } else {
      setShowHelpText(isInputPhoneNumber(accountValue));
    }
  }, [accountValue, isSubAccount]);

  const matchedSuffixes = useMemo(() => {
    if (!accountValue) return [];
    const index = accountValue.indexOf('@');
    if (index === -1) return [];
    const _suffix = accountValue.slice(index + 1);
    return emailSuffixes.filter(item => item.startsWith(_suffix) && item !== _suffix);
  }, [accountValue, emailSuffixes]);

  const rules = [
    {
      validator: (_: any, value: string) => {
        if (errorTips) return Promise.reject(errorTips);
        return Promise.resolve();
      },
      message: errorTips,
    },
  ];

  if (isSubAccount) {
    // 子账号
    rules.push(
      {
        validator: (_: any, value: string) => {
          // 未输入提示
          if (typeof value === 'string' && value.trim() === '') {
            return Promise.reject(t('form_required'));
          }
          return Promise.resolve();
        },
        message: t('form_required'),
      },
      {
        validator: (_: any, value: string) => {
          // 超长提示
          if (value?.trim?.()?.length > 24) {
            return Promise.reject(t('6f8743d779524000a276'));
          }
          return Promise.resolve();
        },
        message: t('6f8743d779524000a276'),
      }
    );
  } else {
    if (supportBoth) {
      // 支持邮箱手机号提示
      rules.push(
        {
          validator: (_: any, value: string) => {
            if ((typeof value === 'string' && value.trim() === '') || !checkAccountType(value)) {
              const isFirstValidate = firstValidateRef.current;
              firstValidateRef.current = false;
              return isFirstValidate ? Promise.resolve() : Promise.reject(t('gB9puTeE34X2uccUWoTnjj'));
            }
            return Promise.resolve();
          },
          message: t('gB9puTeE34X2uccUWoTnjj'),
        },
        {
          validator: (_: any, value: string) => {
            // 邮箱提示
            if (!checkAccountType(value) && /@/.test(value)) {
              return Promise.reject(t('fsCtaeGdJidTiUDSdysTGN'));
            }
            return Promise.resolve();
          },
          message: t('fsCtaeGdJidTiUDSdysTGN'),
        },
        {
          validator: (_: any, value: string) => {
            // 手机区号提示
            if (['forgetPwd', 'login'].some(i => i === scene)) return Promise.resolve();
            if (checkAccountType(value) === 'phone' && !countryCodeValue) {
              return Promise.reject(t('tFfRcu2BufuXheRP4fbUTe'));
            }
            return Promise.resolve();
          },
          message: t('tFfRcu2BufuXheRP4fbUTe'),
        }
      );
    } else if (supportEmailAccount) {
      // 只提示邮箱
      rules.push(
        {
          validator: (_: any, value: string) => {
            if (!checkAccountType(value, 'email') && /@/.test(value)) {
              return Promise.reject(t('fsCtaeGdJidTiUDSdysTGN'));
            }
            return Promise.resolve();
          },
          message: t('fsCtaeGdJidTiUDSdysTGN'),
        },
        {
          validator: (_: any, value: string) => {
            if (!checkAccountType(value, 'email')) {
              return Promise.reject(t('form_email_error'));
            }
            return Promise.resolve();
          },
          message: t('form_email_error'),
        }
      );
    } else if (supportPhoneAccount) {
      // 只提示手机号
      rules.push(
        {
          validator: (_: any, value: string) => {
            if (!checkAccountType(value, 'phone')) {
              return Promise.reject(t('form_phone_error'));
            }
            return Promise.resolve();
          },
          message: t('form_phone_error'),
        },
        {
          validator: (_: any, value: string) => {
            if (['forgetPwd', 'login'].some(i => i === scene)) return Promise.resolve();
            if (checkAccountType(value, 'phone') === 'phone' && !countryCodeValue) {
              return Promise.reject(t('tFfRcu2BufuXheRP4fbUTe'));
            }
            return Promise.resolve();
          },
          message: t('tFfRcu2BufuXheRP4fbUTe'),
        }
      );
    }
  }

  const showPrefix = supportPhoneAccount && accountValue && isInputPhoneNumber(accountValue) && !isSubAccount;
  const showHelp = showHelpText && supportPhoneAccount && (!countryCodeValue || inputIsFocus);

  return (
    <div className={styles.formItemBox}>
      {/* @ts-ignore */}
      <FormItem
        name="account"
        label={isSubAccount ? t('5de5eaee1ccf4000a8f1') : getAccountLabel()}
        rules={rules}
        validateTrigger={validateTrigger}
        help={!showHelp ? null : t('40d69ded64584000ae66')}
        initialValue={initValues?.account}
      >
        {/* @ts-ignore */}
        <Input
          id="login_account_input"
          disabled={disabled}
          size="xlarge"
          placeholder={isSubAccount ? t('5de5eaee1ccf4000a8f1') : getAccountLabel(true)}
          onFocus={handleAccountFocus}
          onBlur={handleAccountBlur}
          onInput={onAccountInput}
          autoComplete="off"
          data-inspector={`signin_${isSubAccount ? 'sub' : 'account'}_input`}
          // 通过css控制显隐，避免dom重复加载
          prefix={
            !showPrefix ? null : (
              <span className={styles.phoneAreaSelectorWrapper}>
                {/* @ts-ignore */}
                <FormItem
                  name="countryCode"
                  noStyle
                  initialValue={tenantConfig.common.initCountryCode || initValues?.countryCode}
                >
                  <PhoneAreaSelector
                    countries={countryCodes}
                    language={language}
                    forbiddenCountry
                    fromDrawer={fromDrawer}
                    scene={scene}
                    disabled={tenantConfig.common.isCountryCodeDisabled ? true : disabled}
                    defaultValue={initValues?.countryCode}
                    useInit={tenantConfig.common.isCountryCodeUseInit ? true : !!initValues?.countryCode}
                  />
                </FormItem>
              </span>
            )
          }
          inputProps={{ autoComplete: 'off' }}
          allowClear
        />
      </FormItem>
      {matchedSuffixes?.length && inputIsFocus && supportEmailAccount ? (
        <ul className={styles.dropdownMenu}>
          {map(matchedSuffixes, item => (
            <li
              className={styles.dropdownMenuItem}
              style={{ direction: 'ltr' }}
              key={item}
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
  );
};

export default FusionInputFormItem;
