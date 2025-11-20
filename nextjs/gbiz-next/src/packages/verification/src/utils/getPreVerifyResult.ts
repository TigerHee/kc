/**
 * Owner: vijay.zhou@kupotech.com
 */
import { isArray, uniqueId } from 'lodash-es';
import plugins from '../plugins';
import { getValidationsUsingPost, GetValidationsUsingPostResponse } from '../api/risk-validation-center';
import * as sensors from './sensors';
import { METHODS, TEXT_METHOD_ORDER } from '../enums';
import { reportMethodNotSupported } from './sentry';
import captcha from './captcha';

/** 对验证方式进行排序，后端不做，要放在前端 */
function sort(method: METHODS[]) {
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

export interface GetPreVerifyResultPayload {
  bizType: string;
  options: { token?: string, address?: string };
  businessData: Record<string, any>;
  permitValidateType?: string[];
}

export interface GetPreVerifyResultResponse {
  needVerify: boolean;
  supplement: string[][];
  transactionId: string;
  token: string;
  methods: METHODS[][];
  errorCode: string | null;
  isNeedSelfService: boolean;
  isNeedLiveVerify: boolean;
  email?: string;
  phone?: string;
}

export default async function getPreVerifyResult({ bizType, businessData, options, permitValidateType }: GetPreVerifyResultPayload): Promise<GetPreVerifyResultResponse> {
  const pluginList = getChromeExtensions();
  const pluginIds: string[] = [];
  const pluginPaths: string[] = [];
  pluginList.forEach((pluginSrc) => {
    const id = pluginSrc.replace('chrome-extension://', '').match(/\w+/)?.[0];
    if (id) {
      pluginIds.push(id);
      const path = pluginSrc.slice(pluginSrc.indexOf(id) + id.length).split('?')[0];
      pluginPaths.push(path);
    }
  });
  try {
    const data: Record<string, string> = {
      pluginList: pluginList.join(','),
      pluginId: pluginIds.join(','),
      pluginPath: pluginPaths.join(','),
      browserType: getBrowserType(),
      ...businessData,
      ...options
    };
    /** 接口新增字段，api 未更新，暂且强转类型，后续需要优化 */
    const res = await getValidationsUsingPost({ bizType, data, permitValidateType }) as any;
    if (res.code !== '200') {
      throw res;
    }
    const { needVerify = true, best = [], others = [], supplement = [], transactionId = '', token = '', isNeedSelfService, isNeedLiveVerify, email, phone } = res.data!;
    const isSupported = best.length && best.every(plugins.has);
    if (needVerify && !isSupported) {
      const error: Error & GetValidationsUsingPostResponse = new Error('[Front-end] Verification method not supported.');
      error.data = { transactionId };
      reportMethodNotSupported({
        bizType,
        transactionId,
        methods: best.filter((field) => !plugins.has(field)),
        isRecommend: true,
      });
      throw error;
    }
    const methods = [sort(best as METHODS[])];
    isArray(others) &&
      others.forEach((other) => {
        // 过滤掉存在不支持验证方式的方案
        if (isArray(other) && other.length) {
          if (other.every((field) => plugins.has(field))) {
            methods.push(sort(other as METHODS[]));
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
    return { errorCode: null, needVerify, transactionId, token, methods, supplement, isNeedSelfService, isNeedLiveVerify, email, phone };
  } catch (error: any) {
    if (error.code === '40011' && await captcha()) {
      // 需要人机校验且通过时，重新获取验证结果
      return getPreVerifyResult({ bizType, businessData, options, permitValidateType });
    }
    const isCodeError = error instanceof Error;
    const code = isCodeError ? -2 : error.code;
    const msg = isCodeError ? error.message : error.msg;
    const transactionId = isCodeError ? `mock_${uniqueId()}` : error.data?.transactionId;
    const supplement = isCodeError ? [] : error.data?.supplement ?? [];
    sensors.throwException({ bizType, transactionId, code, message: msg });
    return { errorCode: code, needVerify: true, transactionId, token: '', methods: [], supplement, isNeedSelfService: false, isNeedLiveVerify: false };
  }
}
