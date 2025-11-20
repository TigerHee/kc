/**
 * Owner: vijay.zhou@kupotech.com
 */
import { useTheme } from '@kux/mui';
import { useSelector } from 'react-redux';
import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { Parser } from 'html-to-react';
import addLangToPath from '@tools/addLangToPath';
import InnerFormItem from '../../components/InnerFormItem';
import { FormItemTipWrapper, FormItemTipText, FormInput } from '../../components/commonUIs';
import Countdown from '../../components/Countdown';
import useSendCode from '../../hooks/useSendCode';
import { METHODS, SEND_CHANNELS } from '../../constants';
import HelpCategory from '../../components/HelpCategory';
import { getVoiceSupportCountry } from '../../services';
import NotReceiveDialog from './NotReceiveDialog';
import useLang from '../../hooks/useLang';
import phoneSrc from '../../../static/phone.svg';
import phoneDarkSrc from '../../../static/phone.dark.svg';
import verificationCodeFormat from '../../utils/verificationCodeFormat';

const htmlToReactParser = new Parser();

export const field = METHODS.SMS;

export const autoSubmit = (form) => {
  const value = form.getFieldValue(field) ?? '';
  return value.length === 6;
};

export const beforeSubmit = (form) => {
  return [`MY_${field}`, form.getFieldValue(field) ?? ''];
};

export const Name = (props) => {
  const { _t } = useLang();
  return <span {...props}>{_t('49d5d81d82714000ab5c')}</span>;
};

export const Icon = (props) => {
  const { currentTheme = 'light' } = useTheme();
  const map = {
    light: phoneSrc,
    dark: phoneDarkSrc,
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
  const { _t } = useLang();
  const { user } = useSelector((state) => state.user);
  const { loading, count, sendCode, isFirst } = useSendCode({
    operationId: `${transactionId}_${SEND_CHANNELS.SMS}`,
    bizType,
    transactionId,
    sendChannel: SEND_CHANNELS.SMS,
  });
  const inputRef = useRef();

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
      label={_t('57b148129dd44000ab1d')}
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
      help={
        <FormItemTipWrapper>
          <FormItemTipText>
            {htmlToReactParser.parse(_t('aGdsBqjypc8mNZG4jBLosx', { phone: user?.phone }))}
          </FormItemTipText>
        </FormItemTipWrapper>
      }
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
        suffix={
          <Countdown
            count={count}
            loading={loading}
            text={isFirst ? _t('48ad1d90c50c4000a6fd') : _t('2e4deb4958ab4000a79a')}
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

export const HelpItem = ({ bizType, transactionId, onlyOne }) => {
  const { _t, i18n } = useLang();
  const { language } = i18n ?? {};
  const { loading, count, sendCode } = useSendCode({
    // 语音验证码虽然通道不同，但复用一个计时器，所以用同一个操作id
    operationId: `${transactionId}_${SEND_CHANNELS.SMS}`,
    bizType,
    transactionId,
    sendChannel: SEND_CHANNELS.VOICE,
  });
  const { user } = useSelector((state) => state.user);
  const [codes, setCodes] = useState([]); // 支持语音的区号列表
  const { countryCode = '', phone = '' } = user ?? {};
  const isSupportVoice =
    codes?.length && (countryCode && `${countryCode}` !== '0' ? codes.includes(countryCode) : true);

  useEffect(() => {
    // 获取支持语音的区号列表
    getVoiceSupportCountry().then((res) => {
      const { success = false, data = [] } = res || {};
      if (success && data && data.length) {
        const _list = [];
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

  const [notReceiveOpen, setNotReceiveOpen] = useState(false);
  const disable = useMemo(() => loading || !!count, [loading, count]);

  const handleSend = useCallback(async () => {
    if (disable) {
      return;
    }
    await sendCode();
    setNotReceiveOpen(false);
  }, [disable, sendCode]);

  return (
    <>
      <HelpCategory
        title={_t('7149224060bb4000a940')}
        items={[
          { label: _t('c340f3f85ea54000ac27'), onClick: () => setNotReceiveOpen(true) },
          {
            label: _t('c37faf26fbbe4000a231'),
            onClick: () => window.open(addLangToPath('/ucenter/rebind-phone/login', language)),
          },
        ]}
        onlyOne={onlyOne}
      />
      <NotReceiveDialog
        open={notReceiveOpen}
        phone={phone}
        countryCode={countryCode}
        onClose={() => setNotReceiveOpen(false)}
        isSupportVoice={isSupportVoice}
        onSend={handleSend}
        disabled={disable}
        countTimer={count}
      />
    </>
  );
};

/** 插件是否启用 */
export const enable = () => true;
