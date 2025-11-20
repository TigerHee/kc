/**
 * Owner: willen@kupotech.com
 */
import _ from 'lodash';

/**
 * 根据lang从fieldOb取值
 * 例如 fieldObj { "zh_CN": "系统正在维护,请耐心等待","en_US": "System is maintenancing" }
 * lang zh_CN
 * @param {*} fieldObj
 * @param {*} lang
 */
const getFieldValueByLang = (fieldObj = {}, lang = 'zh_CN') => {
  const supportLang = ['zh_CN', 'en_US'];
  const defaultLang = 'en_US';
  const finalLang = _.includes(supportLang, lang) ? lang : defaultLang;
  return _.get(fieldObj, finalLang);
};
// 转换停机通知静态json相关字段，与getMaintenanceStatus的返回数据结构保持一致
export default function convertMaintenanceJSON(jsonData = {}, currentLang) {
  const { titleList, linkUrlList, linkTextList, ...others } = jsonData || {};
  if (!titleList) return {};
  return {
    ...others,
    title: getFieldValueByLang(titleList, currentLang),
    link: getFieldValueByLang(linkUrlList, currentLang),
    redirectContent: getFieldValueByLang(linkTextList, currentLang),
  };
}
