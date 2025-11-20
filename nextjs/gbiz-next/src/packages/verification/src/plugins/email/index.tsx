/**
 * Owner: vijay.zhou@kupotech.com
 */
import { Parser } from 'html-to-react';
import { useEffect, useRef } from 'react';
import useSendCode from '../../hooks/useSendCode';
import { METHODS, SEND_CHANNELS } from '../../enums';
import useLang from '../../hooks/useLang';
import { EmailThinIcon, IIconProps } from '@kux/iconpack';
import verificationCodeFormat from '../../utils/verificationCodeFormat';
import InnerFormItem from '../../components/Verification/components/FormItem';
import Countdown from '../../components/Verification/components/Countdown';
import { Input } from '@kux/design';
import { FormInstance } from 'rc-field-form';
import { useVerification } from '../../components/Verification/model';
import styles from './styles.module.scss';

const htmlToReactParser = new (Parser as any)();

/** 验证方式编码 */
export const field = METHODS.EMAIL;

/** 判断自动提交 */
export const autoSubmit = (form: FormInstance) => {
  const value = form.getFieldValue(field) ?? '';
  return value.length === 6;
};

/** 提交前处理 */
export const beforeSubmit = (form: FormInstance) => {
  // 返回新的key和value
  // 部分字段可能存在风控编码和最终提交验证的字段名不一致
  // 例如邮箱，在风控编码是 EMV，在安全验证场景只能发送到自己的邮箱
  // 所以提交验证对应字段名应为 MY_EMV
  return [`MY_${field}`, form.getFieldValue(field) ?? ''];
};

/** 切换验证方式-名称 */
export const Name = (props: React.HTMLAttributes<HTMLSpanElement>) => {
  const { t } = useLang();
  return <span {...props}>{t('3542b4a3ce524000acb7')}</span>;
};

/** 切换验证方式-图标 */
export const Icon = (props: IIconProps) => {
  return <EmailThinIcon {...props} />;
};

/** 验证表单的表单项目 */
export const VerifyItem = ({
  bizType,
  transactionId,
  value,
  onlyOne,
  onValueChange,
  onReFocus,
}) => {
  const { t } = useLang();
  const { combineResult } = useVerification();
  const { loading, count, sendCode, isFirst } = useSendCode({
    operationId: `${transactionId}_${SEND_CHANNELS.EMAIL}`,
    bizType,
    transactionId,
    sendChannel: SEND_CHANNELS.EMAIL,
  });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 仅有一项时自动聚焦
    onlyOne && inputRef.current?.focus();
  }, [onlyOne]);

  useEffect(() => {
    // 仅有一项时自动发送验证码，只触发一次
    onlyOne && isFirst && sendCode();
  }, [onlyOne, sendCode, isFirst]);

  return (
    <InnerFormItem
      label={t('bcd5cd3ba1f04000a750')}
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
      help={
        <span className={styles.desc}>
            {htmlToReactParser.parse(t('tung7oRbHSRMT3fw878BMA', { email: combineResult?.email }))}
          </span>
      }
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
        suffix={
          <Countdown
            count={count}
            loading={loading}
            text={isFirst ? t('48ad1d90c50c4000a6fd') : t('2e4deb4958ab4000a79a')}
            onClick={sendCode}
          />
        }
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
