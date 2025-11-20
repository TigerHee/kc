/**
 * Owner: tiger@kupotech.com
 */
import { isObject } from 'lodash';
import JsBridge from '@tools/bridge';

/**
 *  预设页面的code
 */
export const IdentityReadyPageCode = 'page_0';
export const JumioPagePageCode = 'page_1';
// 结果页
export const SubmitResultPageCode = 'page_7';
// NDID相关
export const NDIDAgreementPageCode = 'page_26';
export const NDIDIDPPageCode = 'page_27';
export const NDIDPendingPageCode = 'page_28';
// 问卷页面
export const questionPageCode1 = 'page_14';
export const questionPageCode2 = 'page_21';
// sumsub
export const sumsubPageCode = 'page_13';
export const sumsubVideoPageCode = 'page_31';
export const sumsubPoaPageCode = 'page_84';
// TR 视频认证指引
export const TRVideoGuidePageCode = 'page_36';
// AU
export const AUQuestionTipPageTemplateCode = 'pageTemplate_1';
export const AUQuestionPageTemplateCode = 'pageTemplate_2';
export const AUTermsPageTemplateCode = 'pageTemplate_3';
// EU
export const EUTermsPageTemplateCode = 'pageTemplate_4';
export const EUCraLoadingPageCode = 'page_59';
export const EUQuestionPageTemplateCode = 'pageTemplate_5';
export const EUTermsV2PageTemplateCode = 'pageTemplate_6';

/**
 *  预设组件的code
 */
// 通用国家
export const COUNTRY_CODE = 'component_25';
// 电话号
export const PHONE_CODE = 'component_2';
// 证件选择
export const ID_TYPE_CODE = 'component_1';
// 证件选择2
export const ID_TYPE_2_CODE = 'component_18';
// 证件到期日
export const EXPIRY_DATE_CODE = 'component_8';
// Laser ID
export const LASER_ID_CODE = 'component_32';
// 交易量
export const TRANS_VOLUME_CODE = 'component_53';
// 机构性质
export const KYB_TYPE_CODE = 'component_54';
// 投资者类型
export const INVESTOR_TYPE_CODE = 'component_92';
// PI 业务类型
export const INVESTOR_TYPE1_CODE = 'component_94';
// 下拉 code
export const COMPONENT_CODE_66 = 'component_66';
export const COMPONENT_CODE_119 = 'component_119';
export const COMPONENT_CODE_120 = 'component_120';
export const COMPONENT_CODE_121 = 'component_121';
export const COMPONENT_CODE_135 = 'component_135';

/**
 *  要素别名
 * */
// 发证国家
export const ISSUE_COUNTRY_ALIAS = 'issuingRegion';
// 发证国家
export const ISSUE_COUNTRY_2_ALIAS = 'issuingRegion2ndDoc';
// 发证国家 auCardStandard
export const ISSUE_COUNTRY_ALIAS_AU = 'issuingRegionAU';

// 证件选择
export const ID_TYPE_ALIAS = 'identityType';
// 证件选择2
export const ID_TYPE_2_ALIAS = 'identityType2ndDoc';
// 证件选择 auCardStandard
export const ID_TYPE_ALIAS_AU = 'identityTypeAU';

// 获取发证国家
export const getIssueCountryCode = (v) => {
  return (
    v[ISSUE_COUNTRY_ALIAS] ||
    v[ISSUE_COUNTRY_2_ALIAS] ||
    v[ISSUE_COUNTRY_ALIAS_AU] ||
    v[Object.keys(v).find((key) => key.includes('issuingRegion'))]
  );
};

// 获取证件类型
export const getIdType = (v) => {
  return (
    v[ID_TYPE_ALIAS] ||
    v[ID_TYPE_2_ALIAS] ||
    v[ID_TYPE_ALIAS_AU] ||
    v[Object.keys(v).find((key) => key.includes('identityType'))]
  );
};

// 支持sumsub的版本号
export const SUPPORT_SUMSUB_VERSION = '3.116.0';
// 支持jumio的版本号
export const SUPPORT_JUMIO_VERSION = '3.100.0';

// 缓存接口数据
export const CACHE_DATA = {};

// 神策 blockid 映射
export const kcsensorsBlockidMap = {
  'page_15': 'MKYCIDConfirm',
  'page_16': 'MKYCAddConfirm',
  'page_17': 'MKYCOccupation',
  'page_21': 'MKYCKnowTest',
  'page_14': 'MKYCRiskTest',
  'page_14_result': 'MKYCRiskResult',
  'page_7': 'MKYCSubmit',
  'page_20': 'MKYCDocUpload',
};

/**
 * 判断两个版本字符串的大小
 * @param  {string} v1 原始版本
 * @param  {string} v2 目标版本
 * @return {number} 如果原始版本大于目标版本，则返回大于0的数值, 如果原始小于目标版本则返回小于0的数值。
 */
export const compareVersion = (v1, v2) => {
  const _v1 = v1.split('.');
  const _v2 = v2.split('.');
  const _r = _v1[0] - _v2[0];

  return _r === 0 && v1 !== v2
    ? compareVersion(_v1.splice(1).join('.'), _v2.splice(1).join('.'))
    : _r;
};

// 获取 url query
export function searchToJson(search) {
  if (!search) {
    search = window.location.search.slice(1);
  }
  const temp = {};
  if (search) {
    try {
      const arr = search.split('&');
      // eslint-disable-next-line no-restricted-syntax
      for (const key in arr) {
        if (Object.prototype.hasOwnProperty.call(arr, key)) {
          const str = arr[key];
          const at = str.indexOf('=');
          const k = str.substring(0, at);
          const v = decodeURIComponent(decodeURI(str.substring(at + 1)));
          temp[k] = v;
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
  return temp;
}

// 获取接口需要的source参数
export const getSource = ({ inApp, isInDialog }) => {
  if (inApp) {
    if (/android/i.test(window.navigator.userAgent)) {
      return 1;
    }
    return 2;
  }
  if (isInDialog) {
    return 3;
  }
  return 4;
};

// 检查设备是否支持 NFC
const SUPPORT_NFC_VERSION = '3.133.0';
export const getIsSupportNfc = async () => {
  const appVersion = await new Promise((resolve) => {
    JsBridge.open(
      {
        type: 'func',
        params: { name: 'getAppVersion' },
      },
      ({ data }) => resolve(data),
    );
  });

  return new Promise((resolve) => {
    if (compareVersion(appVersion, SUPPORT_NFC_VERSION) >= 0) {
      JsBridge.open(
        {
          type: 'func',
          params: { name: 'isSupportNfc' },
        },
        (res) => {
          return resolve(Boolean(res?.data));
        },
      );
    } else {
      resolve(true);
    }
  });
};

// 上报 AppsFlyer
export const onAppsFlyerTrack = async (eventId, data = {}) => {
  try {
    if (JsBridge.isApp()) {
      const appVersion = await new Promise((resolve) => {
        JsBridge.open(
          {
            type: 'func',
            params: { name: 'getAppVersion' },
          },
          ({ data }) => resolve(data),
        );
      });

      if (compareVersion(appVersion, '3.138.0') >= 0) {
        JsBridge.open(
          {
            type: 'func',
            params: {
              name: 'afTrack',
              eventId,
              params: JSON.stringify(data),
            },
          },
          () => {},
        );
      }
    }
  } catch (error) {
    console.error(error);
  }
};

// JSON 字段串转对象
export const getJsonStringToObj = (str) => {
  try {
    if (!str) {
      return {};
    }
    if (isObject(str)) {
      return str;
    }
    return JSON.parse(str);
  } catch (error) {
    return {};
  }
};
