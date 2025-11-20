/**
 * Owner: iron@kupotech.com
 */
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '@tools/i18n';
import { getAuthPayload, ga } from '../../helper';
import { APP_KEY, SEC_KEY } from '../../config';

function useIMinit({
  env = 'DEV',
  onError,
  receiveNewMessage,
  onMsgReceiptChange,
  receiveSyncMessage,
}) {
  const [loaded, setLoaded] = useState(false);

  const { t: _t } = useTranslation('im');

  const loadedIm = useCallback(() => {
    window.JIM.onMsgReceive((data) => {
      // 收到新消息
      receiveNewMessage && receiveNewMessage(data);
    });
    window.JIM.onMsgReceiptChange((data) => {
      // 消息已读数变更
      onMsgReceiptChange && onMsgReceiptChange(data);
    });
    window.JIM.onDisconnect(() => {
      onError && onError(_t('im.error.service.connect.error'));
    });
    window.JIM.onSyncEvent(() => {});
    window.JIM.onSyncConversation((data) => {
      // 离线消息
      receiveSyncMessage && receiveSyncMessage(data);
    });
    if (window.JIM.isInit()) {
      setLoaded(true);
      return;
    }
    window.JIM.init({ ...getAuthPayload(APP_KEY[env], SEC_KEY[env]) })
      .onSuccess(() => {
        setLoaded(true);
      })
      .onFail((err) => {
        ga('app_otc_im_exception_code', { data: err });
        onError && onError(_t('im.error.service.connect.error'));
      });
  }, [env, receiveNewMessage, onMsgReceiptChange, onError, receiveSyncMessage]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (window.JIM) {
        loadedIm();
        clearInterval(timer);
      }
    }, 500);
  }, [loadedIm]);

  return loaded;
}

export default useIMinit;
