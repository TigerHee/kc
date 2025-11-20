/**
 * Owner: herin.yao@kupotech.com
 */
import { init } from '@kc/web-kunlun';

export default function initKunlun() {
  try {
    init({
      // 需要在 kunlun 上重点关注的接口
      apis: [
        '/_api/campaign-center/lego/config/detail/online',      // lego 1.0 模板数据
        '/_api/campaign-center/lego/activity/registration',     // lego 1.0 活动报名
        '/_api/platform-doraemon/get/activity/config',          // lego 2.0 模板数据
        '/_api/platform-doraemon/activity/sign-up',             // lego 2.0 活动报名
      ],
      site: window._BRAND_SITE_ || 'KC',
      project: 'landing-web',
    });
  } catch (e) {
    console.error('initKunlun error:', e);
  }
}
