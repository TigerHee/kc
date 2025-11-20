/**
 * Owner: iron@kupotech.com
 */
import pageEvent from './pageEvent';
import * as spm from './spm';

const origins = {
  t0: Date.now(), // 用户进入页面的时间
  originPathname: window.location.pathname,
  originSearch: window.location.search,
};

const enterCallback = () => {
  // 记录用户进入页面的时间
  origins.t0 = Date.now();
  // 记录pathname
  origins.originPathname = window.location.pathname;
  origins.originSearch = window.location.search;
};

const leaveCallback = () => {
  // 用户离开，记录停留时长，并上报
  window.sensors.track('web_page_leave', {
    pre_spm_id: spm.getPreSpmCode(),
    site_id: spm.getSiteId(),
    page_id: spm.getPageId(origins.originPathname),
    event_duration: (Date.now() - origins.t0) / 1000,
  });
};

export default () => {
  pageEvent.on('$enter', enterCallback);

  pageEvent.on('$leave', leaveCallback);
};
