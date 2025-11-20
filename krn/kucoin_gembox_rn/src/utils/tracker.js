/**
 * Owner: roger.chen@kupotech.com
 */
/**
 * 埋点
 */
import Bridge from 'utils/bridge';

export const track = (eventId, properties) => {
  // console.log('埋点-->', eventId, JSON.stringify(properties));
  Bridge.sensorsTrack(eventId, properties);
};

export const eventIdMap = {
  pageView: 'page_view',
  pageExpose: 'app_page_expose',
  expose: 'expose',
  pageClick: 'page_click',
  successRate: 'success_rate',
  technologyEvent: 'technology_event',
};

const defaultSiteId = 'kcApp';
let defaultPreSpmId = '';

export const setPreSpmId = spm => {
  defaultPreSpmId = spm || '';
};

/**
 * pageId: 页面id
 * blockId: 模块id
 * locationId: 元素id
 * siteId: 站点id
 */
export const getSpmId = (
  pageId,
  blockId,
  locationId,
  siteId = defaultSiteId,
) => {
  return `${siteId}.${pageId}.${blockId}.${locationId}`;
};

// 页面浏览, eventDuration 时间
export const onPageView = ({
  pageId,
  eventDuration,
  preSpmId = defaultPreSpmId,
  properties = null,
}) => {
  try {
    const _eventDuration = eventDuration
      ? Number(eventDuration / 1000).toFixed(3)
      : 0;
    track(eventIdMap.pageView, {
      pre_spm_id: preSpmId,
      site_id: defaultSiteId,
      page_id: pageId,
      event_duration: _eventDuration,
      ...(properties || {}),
    });
  } catch (e) {
    console.log(e);
  }
};

// 页面曝光
export const onPageExpose = ({
  pageId,
  preSpmId = defaultPreSpmId,
  properties = null,
}) => {
  try {
    track(eventIdMap.pageExpose, {
      pre_spm_id: preSpmId,
      site_id: defaultSiteId,
      page_id: pageId,
      ...(properties || {}),
    });
  } catch (e) {
    console.log(e);
  }
};

// 其他曝光
export const onExpose = ({
  pageId,
  blockId,
  locationId,
  siteId = defaultSiteId,
  properties = null,
}) => {
  try {
    const spm_id = getSpmId(pageId, blockId, locationId, siteId);
    track(eventIdMap.expose, {
      spm_id,
      ...(properties || {}),
    });
  } catch (e) {
    console.log(e);
  }
};

// 点击
export const onClickTrack = ({
  pageId,
  blockId,
  locationId,
  siteId = defaultSiteId,
  properties = null,
  buttonName = '',
}) => {
  try {
    const spm_id = getSpmId(pageId, blockId, locationId, siteId);
    track(eventIdMap.pageClick, {
      spm_id,
      button_name: buttonName,
      ...(properties || {}),
    });
  } catch (e) {
    console.log(e);
  }
};
