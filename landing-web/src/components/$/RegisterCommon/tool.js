/**
 * Owner: jesse.shao@kupotech.com
 */
export function uet_report_conversion() {
  window.uetq = window.uetq || [];
  window.uetq.push('event', 'signup', { event_category: 'register' });
}
// 追踪fb注册事件
export const trackFbRegister = options => {
  if (typeof window.fbq === 'function') {
    const _data = typeof options === 'object' ? options : {};
    const { uid } = _data;
    window.fbq('track', 'CompleteRegistration', {
      content_nam: uid,
    });
  }
};
