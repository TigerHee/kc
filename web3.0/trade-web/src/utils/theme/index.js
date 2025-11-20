/**
 * Owner: odan.ou@kupotech.com
 */
// 用于扩展emotion中css in js 的写法时提供的样式变量不足的问题
import { dark } from './dark';
import { light } from './light';
// eslint-disable-next-line
import themeColors from './themeColors';

const themeObj = {
  dark,
  light,
};

/**
 * @typedef { 'dark' | 'light' } ThemeType
 */

/**
 * @typedef { typeof dark & typeof themeColors } AllColorType
 */

/**
 * @typedef { keyof AllColorType } AllColorKeysType
 */

/**
 * 获取主题
 * @param {ThemeType} currentTheme
 * @returns { typeof dark }
 */
const getTheme = (currentTheme) => {
  return themeObj[currentTheme] || {};
};

/**
 * 获取主题变量的值
 * @param {ThemeType} currentTheme
 * @param { typeof dark } sytleVar
 */
export const getThemeVal = (currentTheme, sytleVar) => {
  return getTheme(currentTheme)?.[sytleVar];
};

/**
 * 获取emotion styled 组件的主题变量值
 * @param { AllColorKeysType } sytleVar
 * @returns { (props) => (AllColorType)[sytleVar]}
 */
const getEmotionThemeVal = (sytleVar) => (props) => {
  const themeColor = props?.theme?.colors?.[sytleVar];
  if (themeColor) return themeColor;
  const currentTheme = props?.theme?.currentTheme;
  return getThemeVal(currentTheme, sytleVar);
};

export const eTheme = getEmotionThemeVal;

/**
 * 获取响应式
 * @param {'sm' | 'md' | 'lg'} breakpoint
 * @param {'down' | 'between' | 'up'} type
 */
const eThemeResponse = (breakpoint, type) => (props) => {
  return props?.theme?.breakpoints?.[type]?.(breakpoint);
};

/**
 * 获取down的响应式
 * @param {Parameters<eThemeResponse>[0]} breakpoint
 */
export const eThemeDown = (breakpoint) => {
  return eThemeResponse(breakpoint, 'down');
};

/**
 * 处理需要自定义展示响应式代码与媒体查询代码
 * props 上对 selfResponse 进行判断
 */
const eResponseHandleFn =
  (breakFn, isUp = false, useSelfResponse = true) =>
  (strArr, ...values) =>
  (props) => {
    try {
      const selfResponse = props.selfResponse === true;
      // 在两个之间
      const isBetweenVal = Array.isArray(breakFn) && breakFn.length === 2;
      const mediaStr =
        typeof breakFn === 'function'
          ? breakFn(props)
          : isBetweenVal
          ? props.theme.breakpoints.between(...breakFn)
          : isUp
          ? props.theme.breakpoints.up(breakFn)
          : props.theme.breakpoints.down(breakFn);
      if (!selfResponse && !mediaStr) return '';
      const styleStr = strArr.reduce((str, val, index) => {
        // index 为基数
        str += val;
        const fn = values[index];
        if (fn != null) {
          if (typeof fn === 'function') {
            str += fn(props);
          } else {
            str += fn;
          }
        }
        return str;
      }, '');
      return `${selfResponse && useSelfResponse ? styleStr : ''} ${
        mediaStr ? `\n${mediaStr}{${styleStr}}` : ''
      }`;
    } catch (err) {
      if (_DEV_) {
        console.error(err);
        throw err;
      }
      return '';
    }
  };

/**
 * 处理需要自定义展示响应式代码与媒体查询代码
 * props 上对 selfResponse 进行判断
 */
export const eResponseHandle = (breakFn, isUp = false) => {
  return eResponseHandleFn(breakFn, isUp);
};

/**
 * 纯响应式处理
 */
export const eResponse = (breakFn, isUp = false) => {
  return eResponseHandleFn(breakFn, isUp, false);
};

/**
 * 处理需要自定义展示响应式代码
 * props 上对 selfResponse 进行判断
 * @param  {...any} args
 */
export const eSelfResponse = (...args) => {
  return eResponseHandle(undefined)(...args);
};
