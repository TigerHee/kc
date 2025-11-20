/**
 * Owner: vijay.zhou@kupotech.com
 */
import { Parser } from 'html-to-react';
import useSendCode from '../../hooks/useSendCode';
import { useEffect, useMemo, useRef, useState } from 'react';
import { METHODS, SEND_CHANNELS } from '../../enums';
import useLang from '../../hooks/useLang';
import { IIconProps, PhoneThinIcon } from '@kux/iconpack';
import InnerFormItem from '../../components/Verification/components/FormItem';
import { Input } from '@kux/design';
import Countdown from '../../components/Verification/components/Countdown';
import verificationCodeFormat from '../../utils/verificationCodeFormat';
import { FormInstance } from 'rc-field-form';
import styles from './styles.module.scss';
import NotReceiveDialog from './NotReceiveDialog';
import { useVerification } from '../../components/Verification/model';
import { isVoiceSupportUsingGet } from '../../api/ucenter';

const htmlToReactParser = new (Parser as any)();

export const field = METHODS.SMS;

export const autoSubmit = (form: FormInstance) => {
  const value = form.getFieldValue(field) ?? '';
  return value.length === 6;
};

export const beforeSubmit = (form: FormInstance) => {
  return [`MY_${field}`, form.getFieldValue(field) ?? ''];
};

export const Name = (props: React.HTMLAttributes<HTMLSpanElement>) => {
  const { t } = useLang();
  return <span {...props}>{t('49d5d81d82714000ab5c')}</span>;
};

export const Icon = (props: IIconProps) => {
  return <PhoneThinIcon {...props} />;
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
  const { combineResult } = useVerification();
  const { phone = '' } = combineResult || {};
  let countryCode = '';
  let address = phone;
  if (phone?.includes('-')) {
    [countryCode, address] = phone.split('-');
  }
  const { loading, count, sendCode, isFirst } = useSendCode({
    operationId: `${transactionId}_${SEND_CHANNELS.SMS}`,
    bizType,
    transactionId,
    sendChannel: SEND_CHANNELS.SMS,
  });
  const { sendCode: sendVoiceCode } = useSendCode({
    // 语音验证码虽然通道不同，但复用一个计时器，所以用同一个操作id
    operationId: `${transactionId}_${SEND_CHANNELS.SMS}`,
    bizType,
    transactionId,
    sendChannel: SEND_CHANNELS.VOICE,
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [codes, setCodes] = useState<string[]>([]); // 支持语音的区号列表

  const isSupportVoice =
  codes?.length && (countryCode && `${countryCode}` !== '0' ? codes.includes(countryCode) : true);

  const disable = useMemo(() => loading || !!count, [loading, count]);

  useEffect(() => {
    // 仅有一项时自动聚焦
    onlyOne && inputRef.current?.focus();
  }, [onlyOne]);

  useEffect(() => {
    // 仅有一项时自动发送验证码，只触发一次
    onlyOne && isFirst && sendCode();
  }, [onlyOne, sendCode, isFirst]);

  useEffect(() => {
    // 获取支持语音的区号列表
    isVoiceSupportUsingGet().then((res) => {
      const { success = false, data = [] } = res || {};
      if (success && data && data.length) {
        const _list: string[] = [];
        data.forEach((item) => {
          const { mobileCode = '' } = item || {};
          if (mobileCode) {
            _list.push(mobileCode);
          }
        });
        setCodes(_list);
      }
    });
  }, []);

  return (
    <>
      <InnerFormItem
        label={t('57b148129dd44000ab1d')}
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
            {htmlToReactParser.parse(t('aGdsBqjypc8mNZG4jBLosx', { phone: `+${countryCode}-${address}` }))}
            &nbsp;
            <u onClick={() => setOpen(true)}>{t('c340f3f85ea54000ac27')}</u>
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
      <NotReceiveDialog
        open={open}
        phone={address}
        countryCode={countryCode}
        disabled={disable}
        countTimer={count}
        onSend={async () => {
          if (disable) {
            return;
          }
          await sendVoiceCode();
          setOpen(false);
        }}
        onClose={() => setOpen(false)}
        isSupportVoice={!!isSupportVoice}
      />
    </>
  );
};

/** 插件是否启用 */
export const enable = () => true;

/** 是验证码插件 */
export const isOTP = () => true;
