import sensors from 'gbiz-next/sensors';
import { IS_CLIENT_ENV, IS_DEV } from 'kc-next/env';
import { getReport } from 'gbiz-next/report';

type ManualTrackData = Record<string, any>;

export const manualTrack = (spm: string[] = [], data: ManualTrackData = {}, type: string = 'expose'): void => {
  const exposeCfg = {
    spm_id: sensors.spm.compose(spm),
    ...data,
  };

  sensors.track(type, exposeCfg);
};

// 需固定上报的参数格式,默认不需要传递kc_siteid，kc_pageid
// 调用神策sdk原生track方法，统一传递了spm_id，site_id等参数
// 默认上传曝光事件
export const saTrackForBiz = ({ saType = 'expose' }, spm: string[] = [], data: any = {}) => {
  if (!sensors) return;
  // kcsensors spm 模块
  window.requestIdleCallback(() => {
    const spmModule = sensors.spm;
    const exposeCfg = {
      spm_id: spmModule.compose(spm),
      ...data,
    };
    sensors.track(saType, exposeCfg);
  });
};

/**
 * 合并埋点动作
 * eventLevelVariables: 事件级别变量 eg: {ad_pop_id: '1', ad_pop_module: 'assets'}
 */
export const ga = async (key?: string) => {
  try {
    // console.log('--埋点--', key, eventLevelVariables);
    if (!key || !IS_CLIENT_ENV) return;
    if (typeof window !== 'undefined' && window._hmt && typeof window._hmt.push === 'function') {
      window._hmt.push(['_trackEvent', key, 'click']);
    }
    const report = await getReport();
    report?.logAction(key, 'click');
  }  catch (err) {
    console.log('ga error...', err);
  }
};

/**
 * 获取携带相关属性的node节点
 *
 * @param {HTMLNode} node node节点
 * @param {string} attr 查询的属性
 */
export const getGaElement = (node: HTMLElement, attr) => {
  if (!node || node.localName === 'body') return;
  const key = node.getAttribute(attr);
  if (key) {
    return key;
  }

  if (!node.parentNode) return;
  return getGaElement(node.parentNode as HTMLElement, attr);
};

export const gaReport = () => {
  if (!IS_DEV) {
    document.body.addEventListener(
      'click',
      (e: Event) => {
        const { target } = e;
        // 这里的上报可利用主线程空闲时间进行上报
        window.requestIdleCallback(() => {
          const key = getGaElement(target as HTMLElement, 'data-ga');
          key && ga(key);
        });
      },
      true,
    );
  }
};
