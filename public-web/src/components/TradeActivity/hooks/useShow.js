/**
 * Owner: jessie@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useEventCallback } from '@kux/mui/hooks';
import { Event } from 'helper';
import debounce from 'lodash/debounce';
import { useEffect } from 'react';

const isApp = JsBridge.isApp();

const useShow = (cb) => {
  const handleOnShow = debounce(
    () => {
      if (cb) cb();
    },
    1000,
    { leading: false, trailing: true },
  );

  const handleWebShow = useEventCallback(() => {
    if (!document.hidden) {
      handleOnShow();
    }
  });

  const handleAppShow = useEventCallback(() => {
    handleOnShow();
  });

  useEffect(() => {
    if (isApp) {
      JsBridge.listenNativeEvent?.off?.('onShow', handleAppShow);
      JsBridge.listenNativeEvent?.on?.('onShow', handleAppShow);
    } else {
      Event.removeHandler(document, 'visibilitychange', handleWebShow);
      Event.addHandler(document, 'visibilitychange', handleWebShow);
    }
    return () => {
      if (isApp) {
        JsBridge.listenNativeEvent?.off?.('onShow', handleAppShow);
      } else {
        Event.removeHandler(document, 'visibilitychange', handleWebShow);
      }
    };
  }, [handleAppShow, handleWebShow]);
};

export default useShow;
