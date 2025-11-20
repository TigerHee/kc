/**
 * Owner: corki@kupotech.com
 * v1版本是两个步骤的弹窗，第一步弹窗是询问用户是否要发送语音验证码，第二步弹窗才是发送验证码的弹窗，v2版本是只有第二步弹窗，用户点击发送验证码后，会直接发送验证码
 */
import { ThemeProvider } from '@kux/mui';
import React, { useEffect, useRef, useState } from 'react';
import { isObject } from 'lodash/isObject';
import { kcsensorsClick, kcsensorsManualTrack } from '../../common/tools';
import NotReceiveDialog from './NotReceiveDialog';
import { getVoiceSupportCountry } from './service';
import { useToast } from '../../hookTool';

const VoiceCodeV2 = (props) => {
  const {
    open = false,
    phone = '',
    email = '',
    countryCode = '',
    disable = false,
    countTime = null,
    title = null,
    onSend = () => {},
    trackingConfig = {},
    onClose = () => {},
  } = props || {};

  const [loading, setLoading] = useState(false);
  const [codes, setCodes] = useState([]); // 支持语音的区号列表
  const isSupportVoice =
    codes?.length && (countryCode && `${countryCode}` !== '0' ? codes.includes(countryCode) : true);

  const toast = useToast();
  const toastRef = useRef(toast);
  toastRef.current = toast;

  const onOk = async () => {
    if (disable) return;
    if (onSend) {
      setLoading(true);
      try {
        await onSend();
        onClose(true);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    // 获取支持语音的区号列表
    getVoiceSupportCountry()
      .then((res) => {
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
      })
      .catch((err) => {
        const msg = isObject(err)
          ? typeof err.msg === 'string'
            ? err.msg
            : JSON.stringify(err.msg)
          : err;
        if (msg) {
          toastRef.current.error(msg);
        }
      });
  }, []);

  useEffect(() => {
    if (open) {
      kcsensorsClick(['noCodeButton', '1']);
      kcsensorsManualTrack({
        spm: ['noCodePopUp', '1'],
        ...((trackingConfig && trackingConfig.data) || {}),
      });
    }
  }, [open, trackingConfig]);

  return (
    <>
      {title}
      <NotReceiveDialog
        open={open}
        phone={phone}
        loading={loading}
        countryCode={countryCode}
        email={email}
        onClose={onClose}
        isSupportVoice={isSupportVoice}
        onSend={onOk}
        disabled={disable}
        countTime={countTime}
      />
    </>
  );
};

export default (props) => {
  return (
    <ThemeProvider theme={props.theme || 'light'}>
      <VoiceCodeV2 {...props} />
    </ThemeProvider>
  );
};
