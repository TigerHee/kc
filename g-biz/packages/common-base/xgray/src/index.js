/**
 * Owner: Chrise@kupotech.com
 */
import { debounce } from 'lodash';
import JsBridge from '@tools/bridge';
import { checkXgray } from './service/service';
import { sentryCaptureEventInfo } from './utils/tools';

const xGrayReloadKey = 'kucoinv2_xgray_reload';

const debounceReload = debounce(
  (reason = '') => {
    try {
      const _xgray_reload = +sessionStorage.getItem(xGrayReloadKey);
      if (_xgray_reload > 0) {
        sentryCaptureEventInfo({
          message: `xgray need reload: ${reason}`,
          tags: { xgrayReload: 'success' },
        });
        console.info('xgrayReload: success');

        sessionStorage.setItem(xGrayReloadKey, _xgray_reload - 1);
        window.location.reload();
      }
    } catch (e) {
      console.log('report xgray reload error');
    }
  },
  500,
  { trailing: false, leading: true },
);

const isInApp = JsBridge.isApp();

// 检查当前项目是否在灰度列表中，支持 curProjectName 为数组
const isCurProjectInXgray = (xgray = '', curProjectName) => {
  const projects = Array.isArray(curProjectName) ? curProjectName : [curProjectName];
  return projects.some((project) => xgray && xgray.toLowerCase().includes(project.toLowerCase()));
};

// 判断是否需要重新加载页面
const shouldReload = (webGray, webGrayPre, curProjectName) => {
  const hasCurProject = (gray) => isCurProjectInXgray(gray, curProjectName);
  // 当webGrayPre === null, 即请求未携带webgray， 此时如果webgray 为beta 且饱含当前项目，则重载
  // 当webGrayPre !== null, 且 webGrayPre !== webGray, 如果 两者中都有当前 则不重载，如果两者中一个包含当前项目，则重载

  if (!webGrayPre && hasCurProject(webGray)) {
    return 'got stable, assigned beta';
  }

  const isBothHasCur = hasCurProject(webGray) && hasCurProject(webGrayPre);
  const isOnlyOneHasCur = !isBothHasCur && (hasCurProject(webGray) || hasCurProject(webGrayPre));

  if (webGrayPre && webGrayPre !== webGray && isOnlyOneHasCur) {
    if (hasCurProject(webGray) && !hasCurProject(webGrayPre)) {
      return `stable to beta webGrayPre:${webGrayPre} beta:${webGray}`;
    }
    return `beta to stable webGrayPre:${webGrayPre} beta:${webGray}`;
  }
  return null;
};

const xgrayCheck = async (curProjectName) => {
  if (isInApp) {
    console.info('xgrayCheck skipped: Running inside app');
    return;
  }
  try {
    // 初始化设置灰度重试次数为2
    sessionStorage.setItem(xGrayReloadKey, 2);

    const res = await checkXgray();
    const { webGray, webGrayPre } = res.data;

    const reason = shouldReload(webGray, webGrayPre, curProjectName);

    if (reason) {
      // eslint-disable-next-line consistent-return
      return debounceReload(reason);
    }
  } catch (err) {
    sentryCaptureEventInfo({
      message: `xgray check error: ${err?.message}`,
      tags: { checkXgray: 'failed' },
    });
    console.error('xgray check error: ', err);
  }
};

// 根据灰度变化确定是否要进行页面刷新
const checkIfXgrayNeedReload = (res, curProjectName) => {
  const isCanceled = res.headers.get('X-GRAY-CANCELED');
  const canceledList = res.headers.get('X-GRAY-CANCELED-LIST') || '';
  const isInCanceledList = isCurProjectInXgray(canceledList, curProjectName);

  if (isCanceled === 'true' && isInCanceledList) {
    // app 内需要通知原生进行处理
    if (isInApp) {
      try {
        JsBridge.open(
          {
            type: 'func',
            params: {
              name: 'updatePackageVersion',
              enable: false,
            },
          },
          () => {
            debounceReload(`xgray canceled(in app): ${canceledList}`);
          },
        );
      } catch (e) {
        console.error('jsbrigde some error', e);
      }
    } else {
      debounceReload(`xgray canceled: ${canceledList}`);
    }
  }
  return res;
};

export { xgrayCheck, checkIfXgrayNeedReload };
