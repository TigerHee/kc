/**
 * Owner: solar@kupotech.com
 */

import createDvaApp, { getStore } from '../../utils/dva';
import { Provider } from 'react-redux';
import transferModel from '../../model';

// 判断是否在ssr环境中，ssr环境需要手动初始化dva然后包裹状态
const isInSSr = !window.getDvaApp;
if (!isInSSr) {
  window.getDvaApp().model(transferModel);
} else {
  createDvaApp([transferModel]);
}

export default function ({ children }) {
  if (isInSSr) {
    return <Provider store={getStore()}>{children}</Provider>;
  }
  return <>{children}</>;
}
