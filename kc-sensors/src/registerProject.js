import isPlainObject from 'lodash/isPlainObject';
import * as spm from './spm';
import { getUid, getVipLevel } from './user';
import { testUA } from './utils';
import trackStay from './trackStay';

const defaultEventConfig = {
  page_view: true, // 是否开启全埋点 $pageview 事件
  web_page_leave: false, // 是否开启 web_page_leave 自定义事件
};

export default function registerProject(
  spmConfig,
  projectConfig,
  eventConfig = defaultEventConfig,
) {
  spm.setSiteId(spmConfig.siteId);
  spm.setPageIdMap(spmConfig.pageIdMap);

  if (!projectConfig.app_name) {
    console.warn('[kc sensors]: please set the public property app_name (package.json name)');
  }

  // 添加公共属性
  window.sensors.registerPage({
    ...projectConfig,
    site_type: window._BRAND_SITE_ || '', // eslint-disable-line no-underscore-dangle
    is_login() {
      return !!getUid();
    },
    is_vip() {
      const level = getVipLevel();
      return !!level && level !== '0';
    },
    vip_level() {
      return getVipLevel();
    },
    pre_spm_id: spm.wrapPv(spm.getPreSpmCode),
    site_id: spm.wrapPv(spm.getSiteId),
    page_id: spm.wrapPv(spm.getPageId),
    JS_env: testUA(),
  });

  if (isPlainObject(eventConfig)) {
    if (eventConfig.page_view) {
      window.sensors.quick('autoTrack');
    }
    if (eventConfig.web_page_leave) {
      trackStay();
    }
  }
}
