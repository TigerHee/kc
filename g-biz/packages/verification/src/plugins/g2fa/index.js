/**
 * Owner: vijay.zhou@kupotech.com
 */
import { useSnackbar, useTheme } from '@kux/mui';
import { useEffect, useRef } from 'react';
import addLangToPath from '@tools/addLangToPath';
import InnerFormItem from '../../components/InnerFormItem';
import { FormInput, SuffixButton } from '../../components/commonUIs';
import { METHODS } from '../../constants';
import useLang from '../../hooks/useLang';
import g2faSrc from '../../../static/g2fa.svg';
import g2faDarkSrc from '../../../static/g2fa.dark.svg';
import * as sensors from '../../utils/sensors';
import verificationCodeFormat from '../../utils/verificationCodeFormat';
import HelpCategory from '../../components/HelpCategory';

export const field = METHODS.GOOGLE_2FA;

export const autoSubmit = (form) => {
  const value = form.getFieldValue(field) ?? '';
  return value.length === 6;
};

export const Name = (props) => {
  const { _t } = useLang();
  return <span {...props}>{_t('8452a0d4a1e84000a101')}</span>;
};

export const Icon = (props) => {
  const { currentTheme = 'light' } = useTheme();
  const map = {
    light: g2faSrc,
    dark: g2faDarkSrc,
  };
  return <img src={map[currentTheme] ?? map.light} alt="icon" {...props} />;
};

export const VerifyItem = ({
  bizType,
  transactionId,
  value,
  onlyOne,
  onValueChange,
  onReFocus,
}) => {
  const { message } = useSnackbar();
  const { _t } = useLang();

  const handlePaste = async () => {
    sensors.pasteG2fa({ bizType, transactionId });
    try {
      // 使用 Clipboard API 读取剪贴板内容
      const text = await navigator.clipboard.readText();
      onValueChange(verificationCodeFormat(text));
    } catch (err) {
      message.error(_t('9b19715625d54000a577'));
    }
  };
  const inputRef = useRef();

  useEffect(() => {
    // 仅有一项时自动聚焦
    onlyOne && inputRef.current?.focus();
  }, [onlyOne]);

  return (
    <InnerFormItem
      label={_t('57e76323df8f4000a6d1')}
      name={field}
      rules={[
        {
          validator: (rule, value, callback) => {
            if (!value || value.length !== 6) {
              callback(new Error(_t('form.format.error')));
            } else {
              callback();
            }
          },
        },
      ]}
    >
      <FormInput
        ref={inputRef}
        inputProps={{ className: 'security-verify-input' }}
        value={value}
        addonAfter={null}
        size="xlarge"
        onFocus={() => onReFocus(field)}
        allowClear
        prefix={<div />}
        suffix={<SuffixButton onClick={handlePaste}>{_t('4c9d75c223b04000a782')}</SuffixButton>}
        onChange={(e) => {
          const { value = '' } = e.target ?? {};
          onValueChange(verificationCodeFormat(value));
        }}
      />
    </InnerFormItem>
  );
};

/** 验证方式不可用的帮助选项 */
export const HelpItem = ({ onlyOne }) => {
  const { _t, i18n } = useLang();
  const { language } = i18n ?? {};

  return (
    <>
      <HelpCategory
        title={_t('57e76323df8f4000a6d1')}
        items={[
          {
            label: _t('42bf96f8d65d4000a016'),
            onClick: () => window.open(addLangToPath('/ucenter/reset-g2fa/login', language)),
          },
        ]}
        onlyOne={onlyOne}
      />
    </>
  );
};

/** 插件是否启用 */
export const enable = () => true;
