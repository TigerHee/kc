/**
 * Owner: Chrise@kupotech.com
 */
import sentry from '@kc/sentry';
import { debounce } from 'lodash';
import { checkXgray } from 'services/xgray';
import sessionStorage from 'src/utils/sessionStorage';

const curProjectName = 'trade-web';

export const debounceReload = debounce(
  (reason = '') => {
    const _xgray_reload = +sessionStorage.getItem('xgray_reload');
    if (_xgray_reload > 0) {
      try {
        sentry.captureEvent({
          message: `xgray need reload: ${ reason}`,
          level: 'info',
          tags: { xgrayReload: 'success' },
        });
        console.info('xgrayReload: success');
      } catch (e) {
        console.log('report xgray reload error');
      }
      sessionStorage.setItem('xgray_reload', _xgray_reload - 1);
      window.location.reload();
    }
  },
  500,
  { trailing: false, leading: true },
);

// 当前项目是不是在灰度列表中
export const isCurProjectInXgray = (xgray = '') => {
  return xgray.toLowerCase().indexOf(curProjectName) > -1;
};

export const xgrayCheck = async () => {
  try {
    // 初始化设置灰度重试次数为2
    sessionStorage.setItem('xgray_reload', 2);

    const res = await checkXgray();
    const { webGray, webGrayPre } = res.data;
    // Todo 待抽离
    // 当webGrayPre === null, 即请求未携带webgray， 此时如果webgray 为beta 且饱含当前项目，则重载
    // 当webGrayPre !== null, 且 webGrayPre !== webGray, 如果 两者中都有当前 则不重载，如果两者中一个包含当前项目，则重载

    const checkIfHasCurProject = (gray) => {
      return gray && gray.indexOf(curProjectName) > -1;
    };

    if (!webGrayPre && checkIfHasCurProject(webGray)) {
      return debounceReload('got stable, assigned beta');
    }
    const isBothHasCur = checkIfHasCurProject(webGray) && checkIfHasCurProject(webGrayPre);
    const isOnlyOnHasCur =
      !isBothHasCur && (checkIfHasCurProject(webGray) || checkIfHasCurProject(webGrayPre));
    if (!!webGrayPre && webGrayPre !== webGray && isOnlyOnHasCur) {
      let reason = 'not the same as assigned';
      if (checkIfHasCurProject(webGray) && !checkIfHasCurProject(webGrayPre)) {
        reason = `stable to beta webGrayPre:${webGrayPre} beta:${webGray}`;
      } else {
        reason = `beta to stable webGrayPre:${webGrayPre} beta:${webGray}`;
      }
      return debounceReload(reason);
    }
  } catch (err) {
    sentry.captureEvent({
      message: `xgray check error: ${err?.message}`,
      level: 'info',
      tags: { checkXgray: 'failed' },
    });
    console.info('checkXgray: failed');
    console.error('xgray check error: ', err);
  }
};
