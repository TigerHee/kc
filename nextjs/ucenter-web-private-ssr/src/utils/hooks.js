/**
 * Owner: willen@kupotech.com
 */
import { useEffect } from 'react';

export const useBrowserPrompt = (msg = '此项操作会导致数据清空, 确定离开当前页面吗？') => {
  useEffect(() => {
    window.onbeforeunload = function beforeLeave(evt) {
      evt = evt || window.event;
      if (evt) {
        evt.returnValue = msg;
      }
      // Chrome 移除了自定义message的功能，采用特定文案
      return '是否离开页面?';
    };
    return () => {
      window.onbeforeunload = null;
    };
  }, []);
};
