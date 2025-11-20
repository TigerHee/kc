/**
 * Owner: vijay.zhou@kupotech.com
 */
import { useEffect, useRef } from 'react';
import InnerFormItem from '../../components/Verification/components/FormItem';
import { METHODS } from '../../enums';
import useLang from '../../hooks/useLang';
import { pasteG2fa } from '../../utils/sensors';
import verificationCodeFormat from '../../utils/verificationCodeFormat';
import { Input, toast } from '@kux/design';
import { FormInstance } from 'rc-field-form';
import { IIconProps, GaThinIcon } from '@kux/iconpack';
import styles from './styles.module.scss';

export const field = METHODS.GOOGLE_2FA;

export const autoSubmit = (form: FormInstance) => {
  const value = form.getFieldValue(field) ?? '';
  return value.length === 6;
};

export const Name = (props: React.HTMLAttributes<HTMLSpanElement>) => {
  const { t } = useLang();
  return <span {...props}>{t('8452a0d4a1e84000a101')}</span>;
};

export const Icon = (props: IIconProps) => {
  return <GaThinIcon {...props} />;
};

export const VerifyItem = ({
  bizType,
  transactionId,
  value,
  onlyOne,
  onValueChange,
  onReFocus,
}) => {
  const { t } = useLang();

  const handlePaste = async () => {
    pasteG2fa({ bizType, transactionId });
    try {
      // 使用 Clipboard API 读取剪贴板内容
      const text = await navigator.clipboard.readText();
      onValueChange(verificationCodeFormat(text));
    } catch (err) {
      toast.error(t('9b19715625d54000a577'));
    }
  };
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 仅有一项时自动聚焦
    onlyOne && inputRef.current?.focus();
  }, [onlyOne]);

  return (
    <InnerFormItem
      label={t('57e76323df8f4000a6d1')}
      name={field}
      rules={[
        {
          validator: (rule, value, callback) => {
            if (!value || value.length !== 6) {
              callback(new Error(t('form.format.error')));
            } else {
              callback();
            }
          },
        },
      ]}
    >
      <Input
        ref={inputRef}
        value={value}
        addonAfter={null}
        size="medium"
        onFocus={() => onReFocus(field)}
        allowClear
        inputProps={{ autoComplete: 'new-password' }}
        prefix={<div />}
        suffix={<span className={styles.suffixButton} onClick={handlePaste}>{t('4c9d75c223b04000a782')}</span>}
        onChange={(e) => {
          const { value = '' } = e.target ?? {};
          onValueChange(verificationCodeFormat(value));
        }}
      />
    </InnerFormItem>
  );
};

/** 插件是否启用 */
export const enable = () => true;

/** 是验证码插件 */
export const isOTP = () => true;