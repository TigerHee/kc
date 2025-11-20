/**
 * Owner: terry@kupotech.com
 */
import addLangToPath from '@tools/addLangToPath';
import storage from '@utils/storage';
import sessionStorage from '@utils/sessionStorage';
import { getCompliantRulers, getPageConfigItems } from './service';
import { track, checkJump, checkHomePage } from './utils';
import { FORBIDDEN_PREFIX, FORBIDDEN_URL, isSSG, SITE_NOT_MATCH_CODE } from './const';

const isForbiddenPage = (pathname) => {
  if (!pathname) return false;
  return !!FORBIDDEN_PREFIX.find((path) => pathname.includes(path));
};

if (typeof window !== 'undefined' && !window._complianceState_) {
  window._complianceState_ = {
    isLoadObserve: false,
    rulers: undefined,
    ruleUID: -1,
    isError: false,
    active: true,
    observeEnable: undefined,
    observePageEnable: undefined,
    init: false,
  };
}

// 页面初始化的时间
const initTime = Date.now();

const INIT_TIME = '__COMPLIANCE_CENTER_RULE_INIT_TIME';

// 每一次合规init初始化，记录一个时间到sessionStorage
const addInitParams = function() {
  try {
    let timeList = sessionStorage.getItem(INIT_TIME);
    if (!timeList) {
      timeList = [initTime];
    } else {
      timeList.push(initTime);
    }
    sessionStorage.setItem(INIT_TIME, timeList);
  } catch (e) {
    console.error(e);
  }
};

// 检查当前任务执行，是否是最新的
const checkUniqueTime = function() {
  try {
    const timeList = sessionStorage.getItem(INIT_TIME) || [];
    if (!timeList.length) return true;
    return timeList[timeList.length - 1] === initTime;
  } catch (e) {
    console.error(e);
  }
};

/**
 * 对于 XMLHttpRequest，浏览器取消请求会导致请求状态为 0，并且 readyState 为 4
 * @param {*} error
 */
const checkCancel = function(error) {
  if (!error || !error.request) return false;
  return error.request.readyState === 4 && error.request.status === 0;
};

export const compliantHelper = {
  async getObserveEnable() {
    let observe = '';
    let observePage = '';
    try {
      const { success, data } = await getPageConfigItems({
        codes: 'WebComplianceCenterObserve',
        businessLine: 'toc',
      });
      if (success && data) {
        const properties = data.properties || [];

        const findData = properties.find((i) => i.property === 'WebComplianceCenterObserve');
        if (findData) {
          const backupValues = findData.backupValues || {};
          observe = backupValues.observe || '';
          observePage = backupValues.observePage || '';
        }
      }
    } catch (e) {
      track({
        data: {
          category: 'compliantCenter',
          name: 'getObserveEnable',
          success: false,
          error: e?.msg || 'getObserveEnable error',
        },
      });
    } finally {
      if (window._complianceState_) {
        window._complianceState_.observeEnable = observe === 'active';
        window._complianceState_.observePageEnable = observePage === 'active';
      }
    }
  },

  getCompliantRulers: async (payload = {}) => {
    let rulerData;
    let isError = false;
    const { initPathName } = payload || {};
    try {
      const { data, success, msg } = await getCompliantRulers();
      if (success) {
        rulerData = data.config || {};
        track({
          data: {
            category: 'compliantCenter',
            name: 'getRuler',
            success: true,
          },
        });
      } else {
        isError = true;
        track({
          data: {
            category: 'compliantCenter',
            name: 'getRuler',
            success: false,
            error: msg || 'data empty',
          },
        });
      }
    } catch (e) {
      console.error(e);
      const isCancel = checkCancel(e);
      const isPathMatch = initPathName === window.location.pathname;
      const isUnique = checkUniqueTime();
      // 如果错误码是站点切换的，boot.js 会处理，这里不用处理
      const isSiteNotMatch = e?.code === SITE_NOT_MATCH_CODE;
      if (isCancel || !isPathMatch || !isUnique || isSiteNotMatch) {
        track({
          data: {
            category: 'compliantCenter',
            name: 'getRuler',
            success: false,
            error: 'page reload',
          },
        });
      } else {
        isError = true;
        track({
          data: {
            category: 'compliantCenter',
            name: 'getRuler',
            success: false,
            error: e,
          },
        });
      }
    } finally {
      if (window && window._complianceState_) {
        window._complianceState_ = {
          ...window._complianceState_,
          rulers: rulerData,
          ruleUID: payload.uid,
          isError,
          init: true,
        };
      }
    }
  },

  async init() {
    try {
      addInitParams();
      const initPathName = window.location.pathname;
      if (!window._complianceState_.isLoadObserve) {
        // 开关只需要加载一次
        window._complianceState_.isLoadObserve = true;
        // 这里需要串行加载，先拿到开关配置
        await this.getObserveEnable();
      }
      await this.getCompliantRulers({ initPathName });

      window.__COMPLIANCE_EVENT.emit(window.__COMPLIANCE_EVENT.evts.RULE_READY);
      // 处理页面访问屏蔽
      this.checkPageForbidden();
    } catch (err) {
      // @TODO: 发起 track
      console.error('合规初始化配置错误:', err);
      track({
        data: {
          category: 'compliantCenter',
          name: 'initError',
          success: false,
          error: err?.message || '合规初始化配置错误',
        },
      });
    }
  },
  checkPageForbidden() {
    try {
      // ssg环境不执行访问屏蔽逻辑，不然ssg页面生成会失败
      if (isSSG) return;
      const { pathname } = window.location;
      // 当前页面就是屏蔽页面了，就不需要进行展业-页面屏蔽逻辑
      if (isForbiddenPage(pathname)) return;
      this.handlePageForbidden(
        pathname,
        addLangToPath(FORBIDDEN_URL, storage.getItem('kucoinv2_lang')),
      );
    } catch (err) {
      console.error('检测是否被禁用异常:', err);
    }
  },
  getState: () => window._complianceState_ || {},
  handlePageForbidden: (pathname, redirectUrl) => {
    try {
      const { isError, observePageEnable, rulers } = window._complianceState_ || {};
      // 是否跳过展业页面屏蔽： 接口调用失败且观察期内
      const isSkip = isError === true && observePageEnable === true;
      if (isSkip) return;
      const { forbidden_pages = [] } = rulers || {};
      const pageJump = checkJump(forbidden_pages || [], pathname);
      const errorJump = isError === true && observePageEnable === false && !checkHomePage(pathname);
      if (!redirectUrl) return;
      if (pageJump && !isError) {
        // 命中合规屏蔽
        window.location.replace(redirectUrl);
      } else if (errorJump) {
        // 网络错误，跳转重试页面
        const retryUrl = addLangToPath(
          `/forbidden?type=compliance&url=${encodeURIComponent(window.location.href)}`,
          storage.getItem('kucoinv2_lang'),
        );
        window.location.replace(retryUrl);
      }
    } catch (err) {
      console.error('处理页面禁用异常:', err);
    }
  },
};
