/**
 * Owner: sean.shi@kupotech.com
 * 是 gbiz 项目中的 v2.js
 */
import React, { useEffect, useState } from 'react';
import { toast } from '@kux/design';
import { isObject } from 'lodash-es';
import { trackClick, kcsensorsManualTrack } from 'tools/sensors';
import NotReceiveDialog from './NotReceiveDialog';
import { isVoiceSupportUsingGet } from '../../api/ucenter'

export interface IVoiceCodeProps {
  open?: boolean;
  phone?: string;
  email?: string;
  countryCode?: string;
  disable?: boolean;
  countTime?: number | null;
  title?: React.ReactNode;
  onSend?: () => Promise<void> | void;
  trackingConfig?: Record<string, any>;
  onClose?: (success?: boolean) => void;
  theme?: any;
}

const VoiceCode: React.FC<IVoiceCodeProps> = (props) => {
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
  const [codes, setCodes] = useState<string[]>([]); // 支持语音的区号列表
  const isSupportVoice =
    codes?.length && (countryCode && `${countryCode}` !== '0' ? codes.includes(countryCode) : true);

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
    isVoiceSupportUsingGet()
      .then((res) => {
        const { success = false, data = [] } = res || {};
        if (success && data && data.length) {
          const _list: string[] = [];
          data.forEach((item: any) => {
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
          ? typeof (err as any).msg === 'string'
            ? (err as any).msg
            : JSON.stringify((err as any).msg)
          : err;
        if (msg) {
          toast.error(msg);
        }
      });
  }, []);

  useEffect(() => {
    if (open) {
      trackClick(['noCodeButton', '1']);
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
        isSupportVoice={!!isSupportVoice}
        onSend={onOk}
        disabled={disable}
        countTime={countTime ?? undefined}
      />
    </>
  );
};

export default VoiceCode;