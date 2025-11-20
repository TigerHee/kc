import JsBridge from "tools/jsBridge";
import addLangToPath from 'tools/addLangToPath';

/** 跳到安全设置页面 */
const goToSecurity = ({ onCancel }: { onCancel?: () => void }) => {
  const isInApp = JsBridge.isApp();
  if (isInApp) {
    JsBridge.open({
      type: 'jump',
      params: { url: '/user/safeSetting' },
    });
    // 跳到原生安全设置后，要关闭当前弹窗，保持和 web 一致的表现
    // 因为 web 返回后会刷新，不会有弹窗，而 app 返回后不会刷新，会有弹窗
    onCancel?.();
  } else {
    window.location.href = addLangToPath('/account/security');
  }
}

export default goToSecurity;