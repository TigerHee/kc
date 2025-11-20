/**
 * Owner: vijay.zhou@kupotech.com
 */
import { isArray, isEqual } from 'lodash';
import plugins from '../plugins';
import { getValidationRating } from '../services';
import * as sensors from './sensors';
import { ERROR_CODE, METHODS, TEXT_METHOD_ORDER } from '../constants';
import { reportMethodNotSupported } from './sentry';

/** 对验证方式进行排序，后端不做，要放在前端 */
function sort(method) {
  return method.sort(
    (method_1, method_2) => TEXT_METHOD_ORDER[method_1] - TEXT_METHOD_ORDER[method_2],
  );
}

/** 风控要求的浏览器类型，只支持 chrome 和 edge */
function getBrowserType() {
  const userAgent = window?.navigator?.userAgent?.toLowerCase() ?? '';
  if (userAgent.indexOf('chrome') > -1) {
    return 'CHROME';
  }
  if (userAgent.indexOf('edge') > -1) {
    return 'EDGE';
  }
  return '';
}

/** 风控要求的浏览器插件列表 */
function getChromeExtensions() {
  try {
    return Array.from(document.scripts)
      .filter((script) => script.src.includes('chrome-extension'))
      .map((script) => script.src);
  } catch (err) {
    console.error(err);
    return [];
  }
}

export default async function getPreVerifyResult(bizType, businessData = {}, permitValidateType) {
  const pluginList = getChromeExtensions();
  const pluginIds = [];
  const pluginPaths = [];
  pluginList.forEach((pluginSrc) => {
    const id = pluginSrc.replace('chrome-extension://', '').match(/\w+/)?.[0];
    if (id) {
      pluginIds.push(id);
      const path = pluginSrc.slice(pluginSrc.indexOf(id) + id.length).split('?')[0];
      pluginPaths.push(path);
    }
  });
  try {
    const data = {
      pluginList: pluginList.join(','),
      pluginId: pluginIds.join(','),
      pluginPath: pluginPaths.join(','),
      browserType: getBrowserType(),
      ...businessData,
    };
    const res = await getValidationRating({ type: bizType, data, permitValidateType });
    if (res.code !== '200') {
      const error = new Error(res.msg);
      error.msg = res.msg;
      error.code = res.code;
      error.data = res.data;
      throw error;
    }
    let { best } = res.data;
    const { needVerify, others, supplement, transactionId, token } = res.data;
    if (isEqual(best, [METHODS.PASSKEY]) && !plugins.get(METHODS.PASSKEY).enable()) {
      // 推荐方案（best）为 passkey 且端上不支持 passkey 时
      if (others?.length) {
        // 备选方案（others）首位补进推荐方案
        best = others.shift() ?? [];
      } else if (supplement?.length) {
        // 没有备选方案但有补充项，模拟后端报错，进入绑定引导
        const err = { code: ERROR_CODE.GO_TO_SECURITY, data: { transactionId, supplement } };
        throw err;
      }
    }
    const isSupported = best.length && best.every(plugins.has);
    if (needVerify && !isSupported) {
      const error = new Error('[Front-end] Verification method not supported.');
      error.transactionId = transactionId;
      reportMethodNotSupported({
        bizType,
        transactionId,
        methods: best.filter((field) => !plugins.has(field)),
        isRecommend: true,
      });
      throw error;
    }
    const methods = [sort(best)];
    isArray(others) &&
      others.forEach((other) => {
        // 过滤掉存在不支持验证方式的方案
        if (isArray(other) && other.length) {
          if (other.every((field) => plugins.has(field))) {
            methods.push(sort(other));
          } else {
            reportMethodNotSupported({
              bizType,
              transactionId,
              methods: other.filter((field) => !plugins.has(field)),
              isRecommend: false,
            });
          }
        }
      });
    return { error: null, needVerify, transactionId, token, methods, supplement };
  } catch (error) {
    const {
      code = -2, // -2 是前端组件错误（有不支持的验证方式）
      msg = '',
      data,
    } = error;
    const { transactionId = '', supplement = [] } = data ?? {};
    sensors.throwException({ bizType, transactionId, code, message: msg });
    return { error, needVerify: true, transactionId: '', token: '', methods: [], supplement };
  }
}
