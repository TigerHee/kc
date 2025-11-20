/**
 * Owner: iron@kupotech.com
 */
import extend from 'dva-model-extend';
import i18next from 'i18next';

export const isPlainObject = (o) => Object.prototype.toString.call(o) === '[object Object]';

export const extendModel = (models, model) => {
  if (Array.isArray(models)) {
    const target = models.find((m) => m.namespace === model.namespace);
    if (target) {
      return extend(model, target);
    }
  }

  return model;
};

export const addI18nResourceBundle = (locales, ns) => {
  Object.keys(locales).forEach((lng) => {
    i18next.addResourceBundle(lng, ns, locales[lng]);
  });
};

const RTLLangs = ['ar_AE', 'ur_PK'];
export const isRTLLanguage = (lang) => RTLLangs.includes(lang);

/**
 * 确保是能够正确解析的JSON字符串
 */
export const safeJSONParse = (jsonString) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return null; // 或者返回其他默认值
  }
};
