/**
 * Owner: melon@kupotech.com
 * Create Date: 2025/01/13 16:57:46
 * FusionInputFormItem - converted to TypeScript with @kux/mui-next
 */
/**
 * 参考的是g-biz那边输入框 https://bitbucket.kucoin.net/projects/KUFD/repos/g-biz/browse/packages/entrance/src/components/FusionInputFormItem/index.js
 * 输入校验规则：
 *  1.不能为空
 *  2.邮箱正则
 *  3.手机号正则
 *  4.区号不能为空
 * 默认区号控制：
 *  1.根据用户 IP默认填充区号
 *    a.国家区号 dismiss 为 true，不默认填充区号 （后端接口）
 *    b.奥地利AT43， 不默认填充手机区号
 *  2.根据用户语言默认填充区号
 *    a.葡萄牙语言 默认+55，巴西区号，不支持葡萄牙注册
 *    b.国家区号 dismiss 为 true, 不默认填充区号
 *  3.展示默认区号
 *    a.对于封禁国家，中国展示中文别名，其他国家展示英文别名
 *    b.正常的展示 +Code
 *  4.区号下拉列表选择
 *    a.对于dismiss为 true 的国家区号 不可选择
 *    b.对于封禁国家，中国展示中文别名，其他国家展示英文别名
 */
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Form, Input } from '@kux/mui-next';
import { debounce, isFunction } from 'lodash-es';
import useTranslation from '@/hooks/useTranslation';
import PhoneAreaSelector from '../PhoneAreaSelector';
import { checkAccountType } from './tools';
import { CountryCodeResponse } from '@/api/ucenter/types.gen';
import { getTenantConfig } from '@/tenant';

import styles from './styles.module.scss';

const tenantConfig = getTenantConfig();

const { FormItem, useWatch } = Form;

/** 输入是否是手机号 */
const isInputPhoneNumber = (accountValue: string): boolean => /^\d{3,}$/.test(accountValue);

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

interface FusionInputFormItemProps {
  form: any;
  countryList: CountryCodeResponse[];
  isZh: boolean;
  lang: string;
  shouldBlurValidate?: boolean;
  focusClearError?: boolean;
  onInputFocus?: () => void;
  onInputBlur?: () => void;
  onInputChange?: () => void;
  onChangeCountryCode?: () => void;
}

/**
 * 融合输入框，根据输入的内容识别是邮箱、手机号，不支持子账号登录，需配合Form使用
 * @param {object} props.form form对象
 * @param {array} props.countryList 国家区号列表
 * @param {object} props.isZh 是否是中文
 * @param {string} props.lang 语言
 * @param {bool} props.shouldBlurValidate 失焦是否会校验
 * @param {function} props.onInputFocus 输入框聚焦回调
 * @param {function} props.onInputBlur 输入框失焦回调
 * @param {function} props.onInputChange 输入框修改回调
 * @param {function} props.onChangeCountryCode 区号选择回调
 *
 * @returns
 */
export const FusionInputFormItem: React.FC<FusionInputFormItemProps> = ({
  form,
  countryList,
  isZh,
  lang,
  shouldBlurValidate = true,
  focusClearError = false,
  onInputFocus,
  onInputBlur,
  onInputChange,
  onChangeCountryCode,
}) => {
  const { t } = useTranslation();
  const validateTrigger = shouldBlurValidate ? ['onBlur', 'onSubmit'] : ['onSubmit'];
  const [inputIsFocus, setInputIsFocus] = useState<boolean>(false);
  const [redEnvelopeAccountInputWidth, setRedEnvelopeAccountInputWidth] = useState<number>(210);
  const accountValue = useWatch('account', form);
  const countryCodeValue = useWatch('countryCode', form);
  const showCountryCode = useMemo(() => isInputPhoneNumber(accountValue), [accountValue]);

  /** focus账号输入框 */
  const handleAccountFocus = () => {
    setInputIsFocus(true);
    if (focusClearError) {
      // 聚焦时先设置错误为空
      form.setFields([{ name: 'account', errors: [] }]);
    }
    isFunction(onInputFocus) && onInputFocus();
  };

  /** 账号输入框失焦 */
  const handleAccountBlur = () => {
    setInputIsFocus(false);
    isFunction(onInputBlur) && onInputBlur();
  };

  /** 屏幕变化时修改下拉选择宽度 */
  const resize = useCallback(
    debounce(() => {
      /** 输入账号的宽度 用于设置下拉选择框的宽度 */
      const redEnvelopeAccountInput = document.getElementById('redEnvelopeAccount');

      redEnvelopeAccountInput && setRedEnvelopeAccountInputWidth(redEnvelopeAccountInput.clientWidth);
    }, 200),
    []
  );

  useIsomorphicLayoutEffect(() => {
    resize();
  }, [resize]);

  useEffect(() => {
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [resize]);

  /** 区号选择 */
  const countryCodeSelect = (
    <FormItem noStyle name="countryCode">
      <PhoneAreaSelector
        overlayBoxWidth={`${redEnvelopeAccountInputWidth}px`}
        countries={countryList}
        isCn={isZh}
        language={lang}
        checkForbidden
        forbiddenCountry
        onChange={onChangeCountryCode}
        disabled={tenantConfig.common.isCountryCodeDisabled}
      />
    </FormItem>
  );

  const rules = [
    {
      // 請填寫此內容
      validator: (rule: any, value: string) => {
        if (typeof value === 'string' && value.trim() === '') {
          return Promise.reject(t('form.required'));
        }
        return Promise.resolve();
      },
      message: t('form.required'),
    },
    {
      // 電郵地址無效
      validator: (rule: any, value: string) => {
        // 带@符号但不满足邮箱正则
        if (!checkAccountType(value) && /@/.test(value)) {
          return Promise.reject(t('fsCtaeGdJidTiUDSdysTGN'));
        }
        return Promise.resolve();
      },
      message: t('fsCtaeGdJidTiUDSdysTGN'),
    },
    {
      // 請輸入有效的電郵地址或電話號碼
      validator: (rule: any, value: string) => {
        if (!checkAccountType(value)) {
          // 不满足任何正则表达
          return Promise.reject(t('gB9puTeE34X2uccUWoTnjj'));
        }
        return Promise.resolve();
      },
      message: t('gB9puTeE34X2uccUWoTnjj'),
    },
    {
      // 請選擇國家區號
      validator: (rule: any, value: string) => {
        if (checkAccountType(value) === 'phone' && !countryCodeValue) {
          return Promise.reject(t('tFfRcu2BufuXheRP4fbUTe'));
        }
        return Promise.resolve();
      },
      message: t('tFfRcu2BufuXheRP4fbUTe'),
    },
  ];

  return (
    <FormItem className={styles.formItem} name="account" rules={rules} validateTrigger={validateTrigger}>
      <Input
        className={styles.input}
        onFocus={handleAccountFocus}
        onBlur={handleAccountBlur}
        onChange={onInputChange}
        id="redEnvelopeAccount"
        showCountryCode={showCountryCode}
        placeholder={t('dy9jB3DZ7dQkbTXPLbgBNt')}
        addonBefore={showCountryCode ? countryCodeSelect : null}
      />
    </FormItem>
  );
};

export default FusionInputFormItem;
