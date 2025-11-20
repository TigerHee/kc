/**
 * Owner: odan.ou@kupotech.com
 */

/**
 * @typedef { typeof themeColors } AllColorType
 */

/**
 * @typedef { keyof AllColorType } AllColorKeysType
 */

/**
 * 获取emotion styled 组件的主题变量值
 * @param { AllColorKeysType } sytleVar
 * @returns { (props) => (AllColorType)[sytleVar]}
 */
const getEmotionThemeVal = (sytleVar) => (props) => {
  return props?.theme?.colors?.[sytleVar] || '';
};

export const eTheme = getEmotionThemeVal;

/**
 * 处理需要自定义展示响应式代码与媒体查询代码
 * @param {[string, string] | string | (props) => string} [breakKey]
 * @param {{
 *  isUp?: boolean,
 *  condition?: boolean,
 *  conditionKey?: string,
 *  negation?: boolean,
 * }} [conf]
 */
const eResponseHandleFn =
  (breakKey, conf = {}) =>
  (strArr, ...values) =>
  (props) => {
    try {
      const {
        isUp = false,
        condition = false,
        conditionKey = 'coditionVal',
        negation = false,
      } = conf || {};
      let selfCondition = false;
      // 在两个之间
      const isBetweenVal = Array.isArray(breakKey) && breakKey.length === 2;
      let mediaStr = '';
      if (condition === true) {
        const coditionVal = props[conditionKey];
        if (typeof breakKey === 'function') {
          selfCondition = breakKey(coditionVal, props);
        } else {
          selfCondition = Array.isArray(breakKey)
            ? breakKey.includes(coditionVal)
            : breakKey === coditionVal;
        }
        if (negation) {
          selfCondition = !selfCondition;
        }
      } else if (typeof breakKey === 'function') {
        mediaStr = breakKey(props);
      } else if (isBetweenVal) {
        mediaStr = props.theme.breakpoints.between(...breakKey);
      } else if (isUp) {
        mediaStr = props.theme.breakpoints.up(breakKey);
      } else if (breakKey) {
        mediaStr = props.theme.breakpoints.down(breakKey);
      }
      if (!selfCondition && !mediaStr) return '';
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
      return `${selfCondition ? styleStr : ''}
      ${mediaStr ? `\n${mediaStr}{${styleStr}}` : ''}`;
    } catch (err) {
      if (_DEV_) {
        console.error(err);
        throw err;
      }
      return '';
    }
  };

/**
 * 容器响应式处理
 */
export const eConditionStyle = (breakVal, conditionKey) => {
  return eResponseHandleFn(breakVal, { condition: true, conditionKey });
};

/**
 * Screen样式响应式处理
 */
export const eScreenStyle = (breakVal) => {
  return eConditionStyle(breakVal, 'screen');
};

/**
 * 条件值为true时的样式
 */
export const eTrueStyle = (conditionKey) => {
  return eConditionStyle(true, conditionKey);
};

/**
 * 条件值为false时的样式
 */
export const eFalseStyle = (conditionKey) => {
  return eConditionStyle(false, conditionKey);
};
