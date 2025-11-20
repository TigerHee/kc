/**
 * Owner: tom@kupotech.com
 */
import { isArray, isString, trim, map, get, forIn, forEach, isObject, isEmpty } from 'lodash';

// 常用正则
export const REGEXP = {
  only_en_and_num: /^[a-zA-Z\d]*[a-zA-Z][a-zA-Z\d]*\d|^[a-zA-Z\d]*\d[a-zA-Z\d]*[a-zA-Z][a-zA-Z\d]*$/, // 数字和英文同时存在
  en_and_num: /^[A-Za-z0-9]+$/, // 数字或英文
  begin_and_end_no_blank: /^[^\s]+(\s+[^\s]+)*$/, // 首尾不能空格
  email:
    /(?:[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-zA-Z0-9-]*[a-zA-Z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/, // eslint-disable-line
  phone: /^\d+$/,
  uid: /^\d+$/,
};

const getFileName = (val) => {
  if (!isString(val)) return '';
  if (val.search('/') === -1) return '';

  const stringArr = val.split('/');
  const name = stringArr[stringArr.length - 1] || '';
  return decodeURIComponent(name);
};

export const initFile = (val) => {
  // 多个文件
  if (isArray(val) && !isEmpty(val)) {
    let checkResult = true;
    const result = map(val, (item) => {
      return {
        uid: item.fileId,
        name: item.fileName,
        status: 'done',
        url: item.originalUrl,
        expiredAt: item.expiredAt,
      };
    });
    forEach(result, (item) => {
      !isObject(item) ? (checkResult = false) : null;
    });

    return checkResult ? result : undefined;
  }

  //  单个文件
  if (isObject(val) && !isEmpty(val)) {
    return [
      {
        uid: val.fileId,
        name: val.fileName,
        status: 'done',
        url: val.originalUrl,
        expiredAt: val.expiredAt,
      },
    ];
  }

  return undefined;
};

export const getFileUrl = (data) => {
  let result = {};
  forIn(data, (value, key) => {
    if (isArray(value)) {
      const temp = map(value, (item) => {
        const response = get(item, 'response', {}) || {};
        return isEmpty(response)
          ? {
            expiredAt: item.expiredAt,
            fileId: item.uid,
            fileName: item.name,
            fileUrl: item.url,
          }
          : {
            expiredAt: response.expiredAt,
            fileId: response.fileId,
            fileName: response.fileName,
            fileUrl: response.originalUrl,
          };
      });
      result = { ...result, [key]: temp };
    } else {
      result = { ...result, [key]: [value] };
    }
  });

  const kycInformation = get(result, 'kycInformation', []) || [];

  return {
    dueDiligenceInfo: get(result, 'dueDiligenceInfo[0]', {}) || {},
    majorLegalEntity: get(result, 'majorLegalEntity[0]', {}) || {},
    legalOpinion: get(result, 'legalOpinion[0]', {}) || {},
    projectWhitePaper: get(result, 'projectWhitePaper[0]', {}) || {},
    signedVersion: get(result, 'signedVersion[0]', {}) || {},
    securityReviewReport: get(result, 'securityReviewReport[0]', {}) || {},
    kycInformation: kycInformation.includes(undefined) ? [] : kycInformation,
    remark: trim(get(result, 'remark[0]', '') || ''),
  };
};

/**
 * 输入当前系统的时间戳；得到最终业务想要的UTC的时间戳
 * 勾选 7.11 20:00
 * 系统为北京：勾选为 UTC+8 20:00   === UTC+0 12:00;  业务实际想要 UTC+0 20:00 所以需要  +8h
 * 系统为纽约：勾选为 UTC-4 20:00   ===  UTC+0  12日00:00;  业务实际想要 UTC+0 20:00 所以需要  -4h
 * 即最终时间戳为  systemTimestamp(勾选的时间) +   timezone(系统时区) * 60 * 60 * 1000
 *（北京时区为8，纽约时区为-4;东时区为正数，西市区为负数）
 */
// offset  希望得到的目标时区(如: 北京时区为8，纽约时区为-4;)
export const getTimestampByZone = (systemTimestamp, targetZone = 0) => {
  // 获取本地时间与格林威治时间的时间差,单位分钟 (北京为-480)
  const diff = new Date().getTimezoneOffset();
  const systemZone = diff / -60;

  const utcTimeStamp = systemTimestamp + systemZone * 60 * 60 * 1000;
  const targetZoneTimeStamp = utcTimeStamp - targetZone * 60 * 60 * 1000;

  return targetZoneTimeStamp;
};

/**
 * 基于UTC的时间戳进行处理，得到最终antd组件展示的时间戳 (与getTimestampByZone恰好相反)
 * 举例 utcTimestamp为 7.11 20:00
 * 系统为北京：需要给antd组件 UTC+8 20:00 === UTC+0 12:00;  所以需要  (UTC+0 20:00) -8h
 * 系统为纽约： 需要给antd组件 UTC-4 20:00   ===  UTC+0  12日00:00;  所以需要  (UTC+0 20:00) -(-4h)
 * 即最终时间戳为  utcTimestamp -  timezone(系统时区) * 60 * 60 * 1000
 *（北京时区为8，纽约时区为-4;东时区为正数，西市区为负数）
 */
export const getSystemTimestamp = (utcTimestamp) => {
  const diff = new Date().getTimezoneOffset();
  //北京时区为8，纽约时区为-5
  const systemZone = diff / -60;

  return utcTimestamp - systemZone * 60 * 60 * 1000;
};
